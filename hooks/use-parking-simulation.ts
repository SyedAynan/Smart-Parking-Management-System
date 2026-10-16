'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ParkingSystem,
  SystemState,
  VehicleType,
  createInitialSystem,
  initializeSystem,
  runSelfTest,
  processVehicleEntry,
  processVehicleExit,
  bubbleSortSlots,
  transitionState,
  setMaintenanceMode,
  addEvent,
  addDebugMessage,
  generateVehicleId,
  getRandomVehicleType,
} from '@/lib/parking-system';

export interface SimulationState {
  system: ParkingSystem;
  isRunning: boolean;
  speed: number;
  mode: 'manual' | 'auto';
  sortSteps: ParkingSystem['slots'][] | null;
  currentSortStep: number;
}

export function useParkingSimulation() {
  const [state, setState] = useState<SimulationState>({
    system: createInitialSystem(),
    isRunning: false,
    speed: 1000,
    mode: 'manual',
    sortSteps: null,
    currentSortStep: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sortIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State machine tick
  const tick = useCallback(() => {
    setState((prev) => {
      let system = { ...prev.system, simTime: prev.system.simTime + 1 };
      const currentState = system.currentState;

      switch (currentState) {
        case 'STATE_IDLE':
          system = transitionState(system, 'STATE_INIT');
          break;

        case 'STATE_INIT':
          system = initializeSystem(system);
          system = transitionState(system, 'STATE_SELF_TEST');
          break;

        case 'STATE_SELF_TEST':
          system = runSelfTest(system);
          if (system.flags.SELF_TEST_PASS) {
            system = transitionState(system, 'STATE_WAIT_INPUT');
          } else {
            system = transitionState(system, 'STATE_ERROR');
          }
          break;

        case 'STATE_WAIT_INPUT':
          // In auto mode, generate random events
          if (prev.mode === 'auto' && system.simTime % 5 === 0) {
            const random = Math.random();
            if (random < 0.4 && system.stats.currentOccupancy < 32) {
              system.flags.ENTRY_REQUEST = true;
              system = transitionState(system, 'STATE_PROCESS_ENTRY');
            } else if (random < 0.7 && system.stats.currentOccupancy > 0) {
              system.flags.EXIT_REQUEST = true;
              system = transitionState(system, 'STATE_PROCESS_EXIT');
            } else if (system.flags.SORT_NEEDED) {
              system = transitionState(system, 'STATE_SORT_SLOTS');
            } else if (system.flags.DISPLAY_UPDATE) {
              system = transitionState(system, 'STATE_DISPLAY');
            }
          }
          break;

        case 'STATE_PROCESS_ENTRY':
          {
            const vehicleType = getRandomVehicleType();
            const vehicleId = generateVehicleId();
            system = processVehicleEntry(system, vehicleType, vehicleId);
            system.flags.ENTRY_REQUEST = false;
            system = transitionState(system, 'STATE_UPDATE_SLOT');
          }
          break;

        case 'STATE_PROCESS_EXIT':
          {
            const occupiedSlots = system.slots.filter((s) => s.status === 'OCCUPIED');
            if (occupiedSlots.length > 0) {
              const randomSlot = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];
              system = processVehicleExit(system, randomSlot.id);
            }
            system.flags.EXIT_REQUEST = false;
            system = transitionState(system, 'STATE_CALC_FEE');
          }
          break;

        case 'STATE_CALC_FEE':
          system.flags.FEE_CALCULATED = true;
          system = transitionState(system, 'STATE_UPDATE_SLOT');
          break;

        case 'STATE_UPDATE_SLOT':
          system.flags.SORT_NEEDED = true;
          system.flags.DISPLAY_UPDATE = true;
          system = transitionState(system, 'STATE_SORT_SLOTS');
          break;

        case 'STATE_SORT_SLOTS':
          {
            const result = bubbleSortSlots(system);
            system = result.system;
            system.flags.SORT_NEEDED = false;
            system.flags.SORT_COMPLETE = true;
            system = transitionState(system, 'STATE_DISPLAY');
          }
          break;

        case 'STATE_DISPLAY':
          system.flags.DISPLAY_UPDATE = false;
          system = transitionState(system, 'STATE_WAIT_INPUT');
          break;

        case 'STATE_ERROR':
          system = addDebugMessage(system, `Error handled: 0x${system.errorCode.toString(16)}`);
          system.flags.ERROR_FLAG = false;
          system.errorCode = 0;
          system = transitionState(system, 'STATE_WAIT_INPUT');
          break;

        case 'STATE_MAINTENANCE':
          if (!system.flags.MAINTENANCE_MODE) {
            system = transitionState(system, 'STATE_WAIT_INPUT');
          }
          break;

        case 'STATE_ANALYTICS':
          system = addEvent(system, {
            type: 'SYSTEM',
            message: 'Analytics report generated',
          });
          system = transitionState(system, 'STATE_WAIT_INPUT');
          break;

        case 'STATE_SHUTDOWN':
          system = addDebugMessage(system, 'System shutdown complete');
          return { ...prev, isRunning: false, system };

        default:
          system = transitionState(system, 'STATE_ERROR');
          system.errorCode = 0xfe;
          break;
      }

      return { ...prev, system };
    });
  }, []);

  // Start/Stop simulation
  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const stop = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      system: createInitialSystem(),
      isRunning: false,
      speed: 1000,
      mode: 'manual',
      sortSteps: null,
      currentSortStep: 0,
    });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const setMode = useCallback((mode: 'manual' | 'auto') => {
    setState((prev) => {
      let system = { ...prev.system };
      system.flags.AUTO_MODE = mode === 'auto';
      system = addDebugMessage(system, `Mode changed to ${mode.toUpperCase()}`);
      return { ...prev, mode, system };
    });
  }, []);

  // Manual actions
  const manualEntry = useCallback((vehicleType: VehicleType) => {
    setState((prev) => {
      const vehicleId = generateVehicleId();
      let system = processVehicleEntry(prev.system, vehicleType, vehicleId);
      system = transitionState(system, 'STATE_UPDATE_SLOT');
      return { ...prev, system };
    });
  }, []);

  const manualExit = useCallback((slotId: number) => {
    setState((prev) => {
      let system = processVehicleExit(prev.system, slotId);
      system = transitionState(system, 'STATE_CALC_FEE');
      return { ...prev, system };
    });
  }, []);

  const toggleMaintenance = useCallback((slotId: number) => {
    setState((prev) => {
      const slot = prev.system.slots[slotId];
      const enabled = slot.status !== 'MAINTENANCE';
      const system = setMaintenanceMode(prev.system, slotId, enabled);
      return { ...prev, system };
    });
  }, []);

  const runSort = useCallback(() => {
    setState((prev) => {
      const result = bubbleSortSlots(prev.system);
      return {
        ...prev,
        system: result.system,
        sortSteps: result.steps,
        currentSortStep: 0,
      };
    });
  }, []);

  const stepForward = useCallback(() => {
    tick();
  }, [tick]);

  // Auto-run effect
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(tick, state.speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.speed, tick]);

  // Sort animation effect
  useEffect(() => {
    if (state.sortSteps && state.currentSortStep < state.sortSteps.length - 1) {
      sortIntervalRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          currentSortStep: prev.currentSortStep + 1,
        }));
      }, 200);
    }

    return () => {
      if (sortIntervalRef.current) {
        clearTimeout(sortIntervalRef.current);
      }
    };
  }, [state.sortSteps, state.currentSortStep]);

  return {
    state,
    start,
    stop,
    reset,
    setSpeed,
    setMode,
    manualEntry,
    manualExit,
    toggleMaintenance,
    runSort,
    stepForward,
  };
}

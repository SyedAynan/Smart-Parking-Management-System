'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ParkingSystem,
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
import { simulationAudio } from '@/lib/simulation-audio';

export interface SimulationState {
  system: ParkingSystem;
  isRunning: boolean;
  speed: number;
  mode: 'manual' | 'auto';
  sortSteps: ParkingSystem['slots'][] | null;
  currentSortStep: number;
  activeTransitSlot: number | null;
}

export function useParkingSimulation() {
  const [state, setState] = useState<SimulationState>({
    system: createInitialSystem(),
    isRunning: false,
    speed: 1000,
    mode: 'manual',
    sortSteps: null,
    currentSortStep: 0,
    activeTransitSlot: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sortIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          // In auto mode, generate continuous realistic parking flow
          if (prev.mode === 'auto' && system.simTime % 4 === 0) {
            const random = Math.random();
            if (random < 0.55 && system.stats.currentOccupancy < 32) {
              const vehicleType = getRandomVehicleType();
              const vehicleId = generateVehicleId();
              system.flags.ENTRY_REQUEST = true;
              system = transitionState(system, 'STATE_PROCESS_ENTRY');
              system = processVehicleEntry(system, vehicleType, vehicleId);
            } else if (random < 0.85 && system.stats.currentOccupancy > 0) {
              const occupiedSlots = system.slots.filter((s) => s.status === 'OCCUPIED');
              if (occupiedSlots.length > 0) {
                const randomSlot = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];
                system.flags.EXIT_REQUEST = true;
                system = transitionState(system, 'STATE_PROCESS_EXIT');
                system = processVehicleExit(system, randomSlot.id);
              }
            } else if (system.flags.SORT_NEEDED) {
              system = transitionState(system, 'STATE_SORT_SLOTS');
            } else if (system.flags.DISPLAY_UPDATE) {
              system = transitionState(system, 'STATE_DISPLAY');
            }
          }
          break;

        case 'STATE_PROCESS_ENTRY':
          system.flags.ENTRY_REQUEST = false;
          system = transitionState(system, 'STATE_UPDATE_SLOT');
          break;

        case 'STATE_PROCESS_EXIT':
          system.flags.EXIT_REQUEST = false;
          system = transitionState(system, 'STATE_CALC_FEE');
          break;

        case 'STATE_CALC_FEE':
          system.flags.FEE_CALCULATED = true;
          system = transitionState(system, 'STATE_UPDATE_SLOT');
          break;

        case 'STATE_UPDATE_SLOT':
          system.flags.SORT_NEEDED = true;
          system.flags.DISPLAY_UPDATE = true;
          system = transitionState(system, 'STATE_DISPLAY');
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
      activeTransitSlot: null,
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

  // Enhanced Manual Actions with True State Transitions
  const manualEntry = useCallback((vehicleType: VehicleType) => {
    setState((prev) => {
      const vehicleId = generateVehicleId();
      let system = transitionState(prev.system, 'STATE_PROCESS_ENTRY');
      system = processVehicleEntry(system, vehicleType, vehicleId);

      const allocatedSlot = system.eventLog[system.eventLog.length - 1]?.slotId ?? null;

      // Automatically advance state machine after gate sequence
      if (transitTimeoutRef.current) clearTimeout(transitTimeoutRef.current);
      transitTimeoutRef.current = setTimeout(() => {
        setState((latest) => {
          let updated = transitionState(latest.system, 'STATE_UPDATE_SLOT');
          updated = transitionState(updated, 'STATE_WAIT_INPUT');
          return { ...latest, system: updated, activeTransitSlot: null };
        });
      }, 2500);

      return { ...prev, system, activeTransitSlot: allocatedSlot };
    });
  }, []);

  const manualExit = useCallback((slotId: number) => {
    setState((prev) => {
      let system = transitionState(prev.system, 'STATE_PROCESS_EXIT');
      system = processVehicleExit(system, slotId);

      if (transitTimeoutRef.current) clearTimeout(transitTimeoutRef.current);
      transitTimeoutRef.current = setTimeout(() => {
        setState((latest) => {
          let updated = transitionState(latest.system, 'STATE_CALC_FEE');
          updated = transitionState(updated, 'STATE_WAIT_INPUT');
          return { ...latest, system: updated, activeTransitSlot: null };
        });
      }, 2000);

      return { ...prev, system, activeTransitSlot: slotId };
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

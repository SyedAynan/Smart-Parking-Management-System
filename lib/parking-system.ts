// Smart Parking Management System - Core Logic
// ARM Microcontroller Simulation for Keil uVision

export type VehicleType = 'CAR' | 'BIKE' | 'TRUCK';
export type SlotStatus = 'EMPTY' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';

export interface ParkingSlot {
  id: number;
  status: SlotStatus;
  vehicleType: VehicleType | null;
  entryTime: number | null;
  vehicleId: string | null;
  fee: number;
}

export interface ParkingEvent {
  timestamp: number;
  type: 'ENTRY' | 'EXIT' | 'RESERVE' | 'CANCEL' | 'MAINTENANCE' | 'SORT' | 'SYSTEM' | 'ERROR' | 'FEE';
  slotId?: number;
  vehicleId?: string;
  vehicleType?: VehicleType;
  message: string;
  fee?: number;
}

export interface SystemFlags {
  INIT_DONE: boolean;
  SLOT_AVAILABLE: boolean;
  SLOT_FULL: boolean;
  ENTRY_REQUEST: boolean;
  EXIT_REQUEST: boolean;
  FEE_CALCULATED: boolean;
  SORT_NEEDED: boolean;
  SORT_COMPLETE: boolean;
  ERROR_FLAG: boolean;
  MAINTENANCE_MODE: boolean;
  AUTO_MODE: boolean;
  SELF_TEST_PASS: boolean;
  DATA_READY: boolean;
  DISPLAY_UPDATE: boolean;
}

export type SystemState = 
  | 'STATE_IDLE'
  | 'STATE_INIT'
  | 'STATE_SELF_TEST'
  | 'STATE_WAIT_INPUT'
  | 'STATE_PROCESS_ENTRY'
  | 'STATE_PROCESS_EXIT'
  | 'STATE_CALC_FEE'
  | 'STATE_UPDATE_SLOT'
  | 'STATE_SORT_SLOTS'
  | 'STATE_DISPLAY'
  | 'STATE_ERROR'
  | 'STATE_MAINTENANCE'
  | 'STATE_SHUTDOWN'
  | 'STATE_ANALYTICS';

export interface SystemStats {
  totalEntries: number;
  totalExits: number;
  totalRevenue: number;
  peakOccupancy: number;
  currentOccupancy: number;
  avgParkingDuration: number;
  carCount: number;
  bikeCount: number;
  truckCount: number;
}

export interface ParkingSystem {
  slots: ParkingSlot[];
  flags: SystemFlags;
  currentState: SystemState;
  previousState: SystemState;
  eventLog: ParkingEvent[];
  stats: SystemStats;
  simTime: number;
  errorCode: number;
  debugMessages: string[];
}

// Fee rates per hour
export const FEE_RATES: Record<VehicleType, number> = {
  CAR: 20,
  BIKE: 10,
  TRUCK: 40,
};

// Slot capacities
export const SLOT_CAPACITY: Record<VehicleType, number> = {
  CAR: 16,
  BIKE: 10,
  TRUCK: 6,
};

export const TOTAL_SLOTS = 32;

export const STATE_DESCRIPTIONS: Record<SystemState, string> = {
  STATE_IDLE: 'System idle, waiting for activation',
  STATE_INIT: 'Initializing parking slots and system variables',
  STATE_SELF_TEST: 'Running self-diagnostic tests',
  STATE_WAIT_INPUT: 'Waiting for user input or auto event',
  STATE_PROCESS_ENTRY: 'Processing vehicle entry request',
  STATE_PROCESS_EXIT: 'Processing vehicle exit request',
  STATE_CALC_FEE: 'Calculating parking fee based on duration',
  STATE_UPDATE_SLOT: 'Updating slot status in memory',
  STATE_SORT_SLOTS: 'Sorting slots by occupancy (Bubble Sort)',
  STATE_DISPLAY: 'Updating display with current status',
  STATE_ERROR: 'Error state - handling system errors',
  STATE_MAINTENANCE: 'Maintenance mode - slots disabled',
  STATE_SHUTDOWN: 'System shutdown sequence',
  STATE_ANALYTICS: 'Generating analytics and reports',
};

export function createInitialSystem(): ParkingSystem {
  const slots: ParkingSlot[] = [];
  
  // Initialize 32 slots with different vehicle type allocations
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    slots.push({
      id: i,
      status: 'EMPTY',
      vehicleType: null,
      entryTime: null,
      vehicleId: null,
      fee: 0,
    });
  }

  return {
    slots,
    flags: {
      INIT_DONE: false,
      SLOT_AVAILABLE: true,
      SLOT_FULL: false,
      ENTRY_REQUEST: false,
      EXIT_REQUEST: false,
      FEE_CALCULATED: false,
      SORT_NEEDED: false,
      SORT_COMPLETE: false,
      ERROR_FLAG: false,
      MAINTENANCE_MODE: false,
      AUTO_MODE: false,
      SELF_TEST_PASS: false,
      DATA_READY: false,
      DISPLAY_UPDATE: false,
    },
    currentState: 'STATE_IDLE',
    previousState: 'STATE_IDLE',
    eventLog: [],
    stats: {
      totalEntries: 0,
      totalExits: 0,
      totalRevenue: 0,
      peakOccupancy: 0,
      currentOccupancy: 0,
      avgParkingDuration: 0,
      carCount: 0,
      bikeCount: 0,
      truckCount: 0,
    },
    simTime: 0,
    errorCode: 0,
    debugMessages: [],
  };
}

export function addDebugMessage(system: ParkingSystem, message: string): ParkingSystem {
  const timestamp = new Date().toLocaleTimeString();
  return {
    ...system,
    debugMessages: [...system.debugMessages.slice(-99), `[${timestamp}] ${message}`],
  };
}

export function addEvent(system: ParkingSystem, event: Omit<ParkingEvent, 'timestamp'>): ParkingSystem {
  return {
    ...system,
    eventLog: [...system.eventLog.slice(-199), { ...event, timestamp: system.simTime }],
  };
}

export function findEmptySlot(system: ParkingSystem, vehicleType: VehicleType): number {
  // Find slot based on vehicle type allocation
  const startIdx = vehicleType === 'CAR' ? 0 : vehicleType === 'BIKE' ? 16 : 26;
  const endIdx = vehicleType === 'CAR' ? 16 : vehicleType === 'BIKE' ? 26 : 32;
  
  for (let i = startIdx; i < endIdx; i++) {
    if (system.slots[i].status === 'EMPTY') {
      return i;
    }
  }
  return -1;
}

export function calculateFee(entryTime: number, exitTime: number, vehicleType: VehicleType): number {
  const durationHours = Math.max(1, Math.ceil((exitTime - entryTime) / 3600));
  return durationHours * FEE_RATES[vehicleType];
}

export function processVehicleEntry(
  system: ParkingSystem,
  vehicleType: VehicleType,
  vehicleId: string
): ParkingSystem {
  let newSystem = { ...system };
  newSystem.flags = { ...system.flags, ENTRY_REQUEST: true };
  newSystem = addDebugMessage(newSystem, `Entry request: ${vehicleType} - ${vehicleId}`);
  
  const slotIdx = findEmptySlot(system, vehicleType);
  
  if (slotIdx === -1) {
    newSystem.flags.ERROR_FLAG = true;
    newSystem.errorCode = 0x01; // No slot available
    newSystem = addEvent(newSystem, {
      type: 'ERROR',
      vehicleId,
      vehicleType,
      message: `No empty slot available for ${vehicleType}`,
    });
    newSystem = addDebugMessage(newSystem, `ERROR: No slot for ${vehicleType}`);
    return newSystem;
  }

  const newSlots = [...system.slots];
  newSlots[slotIdx] = {
    ...newSlots[slotIdx],
    status: 'OCCUPIED',
    vehicleType,
    entryTime: system.simTime,
    vehicleId,
    fee: 0,
  };

  newSystem.slots = newSlots;
  newSystem.flags.ENTRY_REQUEST = false;
  newSystem.flags.SORT_NEEDED = true;
  newSystem.flags.DISPLAY_UPDATE = true;
  
  // Update stats
  newSystem.stats = {
    ...system.stats,
    totalEntries: system.stats.totalEntries + 1,
    currentOccupancy: system.stats.currentOccupancy + 1,
    peakOccupancy: Math.max(system.stats.peakOccupancy, system.stats.currentOccupancy + 1),
    carCount: vehicleType === 'CAR' ? system.stats.carCount + 1 : system.stats.carCount,
    bikeCount: vehicleType === 'BIKE' ? system.stats.bikeCount + 1 : system.stats.bikeCount,
    truckCount: vehicleType === 'TRUCK' ? system.stats.truckCount + 1 : system.stats.truckCount,
  };

  newSystem = addEvent(newSystem, {
    type: 'ENTRY',
    slotId: slotIdx,
    vehicleId,
    vehicleType,
    message: `${vehicleType} ${vehicleId} entered slot ${slotIdx}`,
  });
  
  newSystem = addDebugMessage(newSystem, `Vehicle parked at slot ${slotIdx}`);
  
  // Check if slots are full
  const emptyCount = newSystem.slots.filter(s => s.status === 'EMPTY').length;
  newSystem.flags.SLOT_FULL = emptyCount === 0;
  newSystem.flags.SLOT_AVAILABLE = emptyCount > 0;

  return newSystem;
}

export function processVehicleExit(system: ParkingSystem, slotId: number): ParkingSystem {
  let newSystem = { ...system };
  newSystem.flags = { ...system.flags, EXIT_REQUEST: true };
  
  const slot = system.slots[slotId];
  
  if (slot.status !== 'OCCUPIED' || !slot.entryTime || !slot.vehicleType) {
    newSystem.flags.ERROR_FLAG = true;
    newSystem.errorCode = 0x02; // Invalid exit request
    newSystem = addEvent(newSystem, {
      type: 'ERROR',
      slotId,
      message: `Invalid exit request for slot ${slotId}`,
    });
    newSystem = addDebugMessage(newSystem, `ERROR: Invalid exit at slot ${slotId}`);
    return newSystem;
  }

  const fee = calculateFee(slot.entryTime, system.simTime, slot.vehicleType);
  
  newSystem = addEvent(newSystem, {
    type: 'FEE',
    slotId,
    vehicleId: slot.vehicleId || undefined,
    vehicleType: slot.vehicleType,
    fee,
    message: `Fee calculated: $${fee} for ${slot.vehicleType}`,
  });
  
  newSystem.flags.FEE_CALCULATED = true;
  newSystem = addDebugMessage(newSystem, `Fee: $${fee} for slot ${slotId}`);

  const newSlots = [...system.slots];
  newSlots[slotId] = {
    ...newSlots[slotId],
    status: 'EMPTY',
    vehicleType: null,
    entryTime: null,
    vehicleId: null,
    fee: 0,
  };

  newSystem.slots = newSlots;
  newSystem.flags.EXIT_REQUEST = false;
  newSystem.flags.SORT_NEEDED = true;
  newSystem.flags.DISPLAY_UPDATE = true;

  // Update stats
  const vehicleType = slot.vehicleType;
  newSystem.stats = {
    ...system.stats,
    totalExits: system.stats.totalExits + 1,
    totalRevenue: system.stats.totalRevenue + fee,
    currentOccupancy: system.stats.currentOccupancy - 1,
    carCount: vehicleType === 'CAR' ? system.stats.carCount - 1 : system.stats.carCount,
    bikeCount: vehicleType === 'BIKE' ? system.stats.bikeCount - 1 : system.stats.bikeCount,
    truckCount: vehicleType === 'TRUCK' ? system.stats.truckCount - 1 : system.stats.truckCount,
  };

  newSystem = addEvent(newSystem, {
    type: 'EXIT',
    slotId,
    vehicleId: slot.vehicleId || undefined,
    vehicleType: slot.vehicleType,
    fee,
    message: `${slot.vehicleType} ${slot.vehicleId} exited slot ${slotId}. Fee: $${fee}`,
  });

  newSystem.flags.SLOT_FULL = false;
  newSystem.flags.SLOT_AVAILABLE = true;
  newSystem.flags.FEE_CALCULATED = false;

  return newSystem;
}

// Bubble sort implementation for sorting slots by occupancy
export function bubbleSortSlots(system: ParkingSystem): { system: ParkingSystem; steps: ParkingSlot[][] } {
  let newSystem = { ...system };
  newSystem.flags = { ...system.flags, SORT_NEEDED: false };
  
  const slots = [...system.slots];
  const steps: ParkingSlot[][] = [slots.map(s => ({ ...s }))];
  
  const n = slots.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const statusOrder = (s: SlotStatus) => 
        s === 'OCCUPIED' ? 0 : s === 'RESERVED' ? 1 : s === 'MAINTENANCE' ? 2 : 3;
      
      if (statusOrder(slots[j].status) > statusOrder(slots[j + 1].status)) {
        // Swap
        const temp = slots[j];
        slots[j] = slots[j + 1];
        slots[j + 1] = temp;
        steps.push(slots.map(s => ({ ...s })));
      }
    }
  }

  newSystem.slots = slots;
  newSystem.flags.SORT_COMPLETE = true;
  newSystem = addEvent(newSystem, {
    type: 'SORT',
    message: `Slots sorted by occupancy (${steps.length - 1} swaps)`,
  });
  newSystem = addDebugMessage(newSystem, `Sort complete: ${steps.length - 1} swaps`);

  return { system: newSystem, steps };
}

export function runSelfTest(system: ParkingSystem): ParkingSystem {
  let newSystem = { ...system };
  newSystem = addDebugMessage(newSystem, 'Running self-test...');
  
  // Test 1: Check slot initialization
  const allSlotsValid = system.slots.every(s => s.id >= 0 && s.id < TOTAL_SLOTS);
  
  // Test 2: Check flag initialization
  const flagsValid = typeof system.flags.INIT_DONE === 'boolean';
  
  // Test 3: Check stats initialization
  const statsValid = system.stats.totalEntries >= 0;

  if (allSlotsValid && flagsValid && statsValid) {
    newSystem.flags.SELF_TEST_PASS = true;
    newSystem = addEvent(newSystem, {
      type: 'SYSTEM',
      message: 'Self-test PASSED - All systems operational',
    });
    newSystem = addDebugMessage(newSystem, 'Self-test PASSED');
  } else {
    newSystem.flags.SELF_TEST_PASS = false;
    newSystem.flags.ERROR_FLAG = true;
    newSystem.errorCode = 0xFF;
    newSystem = addEvent(newSystem, {
      type: 'ERROR',
      message: 'Self-test FAILED - System error detected',
    });
    newSystem = addDebugMessage(newSystem, 'Self-test FAILED');
  }

  return newSystem;
}

export function initializeSystem(system: ParkingSystem): ParkingSystem {
  let newSystem = createInitialSystem();
  newSystem.simTime = system.simTime;
  newSystem.flags.INIT_DONE = true;
  newSystem.flags.DATA_READY = true;
  newSystem = addEvent(newSystem, {
    type: 'SYSTEM',
    message: 'System initialized - 32 slots ready',
  });
  newSystem = addDebugMessage(newSystem, 'System initialized');
  return newSystem;
}

export function transitionState(system: ParkingSystem, newState: SystemState): ParkingSystem {
  const newSystem = {
    ...system,
    previousState: system.currentState,
    currentState: newState,
  };
  return addDebugMessage(newSystem, `State: ${system.currentState} -> ${newState}`);
}

export function setMaintenanceMode(system: ParkingSystem, slotId: number, enabled: boolean): ParkingSystem {
  let newSystem = { ...system };
  const newSlots = [...system.slots];
  
  if (enabled) {
    newSlots[slotId] = {
      ...newSlots[slotId],
      status: 'MAINTENANCE',
      vehicleType: null,
      entryTime: null,
      vehicleId: null,
    };
    newSystem = addEvent(newSystem, {
      type: 'MAINTENANCE',
      slotId,
      message: `Slot ${slotId} set to maintenance mode`,
    });
  } else {
    newSlots[slotId] = {
      ...newSlots[slotId],
      status: 'EMPTY',
    };
    newSystem = addEvent(newSystem, {
      type: 'MAINTENANCE',
      slotId,
      message: `Slot ${slotId} maintenance complete`,
    });
  }
  
  newSystem.slots = newSlots;
  newSystem.flags.DISPLAY_UPDATE = true;
  return newSystem;
}

export function generateVehicleId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let id = '';
  for (let i = 0; i < 2; i++) id += letters[Math.floor(Math.random() * letters.length)];
  for (let i = 0; i < 4; i++) id += numbers[Math.floor(Math.random() * numbers.length)];
  return id;
}

export function getRandomVehicleType(): VehicleType {
  const types: VehicleType[] = ['CAR', 'CAR', 'CAR', 'BIKE', 'BIKE', 'TRUCK'];
  return types[Math.floor(Math.random() * types.length)];
}

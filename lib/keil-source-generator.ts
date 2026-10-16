// Keil uVision Source Code Generator
// Generates complete C/H source files for ARM Microcontroller

export function generateMainC(): string {
  return `/*******************************************************************************
 * Smart Parking Management System - Main Application
 * Target: ARM Cortex-M3 (LPC1768)
 * IDE: Keil uVision5
 * 
 * Features:
 * - 32 parking slot management (16 Cars, 10 Bikes, 6 Trucks)
 * - Real-time fee calculation based on duration
 * - Bubble sort for slot organization
 * - State machine architecture
 * - Live debug dashboard support
 ******************************************************************************/

#include "parking_system.h"
#include "ui_dashboard.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*******************************************************************************
 * Global Variables - Visible in Keil Watch Window
 ******************************************************************************/
volatile ParkingSystem_t g_system;           // Main system structure
volatile uint32_t g_sim_time = 0;            // Simulation time counter
volatile uint8_t g_auto_mode = 0;            // Auto/Manual mode flag
volatile uint8_t g_running = 1;              // System running flag

// Debug variables for Watch Window
volatile SystemState_t dbg_current_state;
volatile SystemState_t dbg_previous_state;
volatile uint8_t dbg_occupied_count;
volatile uint8_t dbg_empty_count;
volatile uint32_t dbg_total_revenue;
volatile uint8_t dbg_error_code;
volatile SystemFlags_t dbg_flags;

/*******************************************************************************
 * Function Prototypes
 ******************************************************************************/
void System_Init(void);
void State_Machine_Run(void);
void Process_Entry(VehicleType_t type, const char* vehicle_id);
void Process_Exit(uint8_t slot_id);
uint32_t Calculate_Fee(uint32_t entry_time, uint32_t exit_time, VehicleType_t type);
void Bubble_Sort_Slots(void);
void Run_Self_Test(void);
void Update_Debug_Vars(void);
void Delay_Ms(uint32_t ms);

/*******************************************************************************
 * Main Entry Point
 ******************************************************************************/
int main(void)
{
    // Initialize system
    System_Init();
    
    printf("\\n=== Smart Parking Management System ===\\n");
    printf("Version: 1.0.0\\n");
    printf("Slots: %d (Cars: %d, Bikes: %d, Trucks: %d)\\n\\n", 
           TOTAL_SLOTS, CAR_SLOTS, BIKE_SLOTS, TRUCK_SLOTS);
    
    // Run self-test
    Run_Self_Test();
    
    if (!g_system.flags.SELF_TEST_PASS) {
        printf("ERROR: Self-test failed! System halted.\\n");
        while(1);
    }
    
    printf("Self-test PASSED. System ready.\\n\\n");
    
    // Main loop
    while (g_running) {
        State_Machine_Run();
        Update_Debug_Vars();
        g_sim_time++;
        Delay_Ms(100);
    }
    
    return 0;
}

/*******************************************************************************
 * System Initialization
 ******************************************************************************/
void System_Init(void)
{
    uint8_t i;
    
    // Initialize all slots
    for (i = 0; i < TOTAL_SLOTS; i++) {
        g_system.slots[i].id = i;
        g_system.slots[i].status = SLOT_EMPTY;
        g_system.slots[i].vehicle_type = VEHICLE_NONE;
        g_system.slots[i].entry_time = 0;
        g_system.slots[i].fee = 0;
        memset(g_system.slots[i].vehicle_id, 0, VEHICLE_ID_LEN);
    }
    
    // Initialize flags
    g_system.flags.INIT_DONE = 1;
    g_system.flags.SLOT_AVAILABLE = 1;
    g_system.flags.SLOT_FULL = 0;
    g_system.flags.ENTRY_REQUEST = 0;
    g_system.flags.EXIT_REQUEST = 0;
    g_system.flags.FEE_CALCULATED = 0;
    g_system.flags.SORT_NEEDED = 0;
    g_system.flags.SORT_COMPLETE = 0;
    g_system.flags.ERROR_FLAG = 0;
    g_system.flags.MAINTENANCE_MODE = 0;
    g_system.flags.AUTO_MODE = 0;
    g_system.flags.SELF_TEST_PASS = 0;
    g_system.flags.DATA_READY = 1;
    g_system.flags.DISPLAY_UPDATE = 1;
    
    // Initialize stats
    g_system.stats.total_entries = 0;
    g_system.stats.total_exits = 0;
    g_system.stats.total_revenue = 0;
    g_system.stats.peak_occupancy = 0;
    g_system.stats.current_occupancy = 0;
    g_system.stats.car_count = 0;
    g_system.stats.bike_count = 0;
    g_system.stats.truck_count = 0;
    
    // Initialize state machine
    g_system.current_state = STATE_IDLE;
    g_system.previous_state = STATE_IDLE;
    g_system.error_code = 0;
    
    printf("[INIT] System initialized successfully\\n");
}

/*******************************************************************************
 * State Machine Implementation
 ******************************************************************************/
void State_Machine_Run(void)
{
    g_system.previous_state = g_system.current_state;
    
    switch (g_system.current_state) {
        case STATE_IDLE:
            if (g_system.flags.INIT_DONE) {
                g_system.current_state = STATE_WAIT_INPUT;
            }
            break;
            
        case STATE_INIT:
            System_Init();
            g_system.current_state = STATE_SELF_TEST;
            break;
            
        case STATE_SELF_TEST:
            Run_Self_Test();
            if (g_system.flags.SELF_TEST_PASS) {
                g_system.current_state = STATE_WAIT_INPUT;
            } else {
                g_system.current_state = STATE_ERROR;
            }
            break;
            
        case STATE_WAIT_INPUT:
            // In auto mode, generate random events
            if (g_auto_mode && (g_sim_time % 50 == 0)) {
                if (rand() % 2 == 0 && g_system.stats.current_occupancy < TOTAL_SLOTS) {
                    g_system.flags.ENTRY_REQUEST = 1;
                } else if (g_system.stats.current_occupancy > 0) {
                    g_system.flags.EXIT_REQUEST = 1;
                }
            }
            
            if (g_system.flags.ENTRY_REQUEST) {
                g_system.current_state = STATE_PROCESS_ENTRY;
            } else if (g_system.flags.EXIT_REQUEST) {
                g_system.current_state = STATE_PROCESS_EXIT;
            } else if (g_system.flags.SORT_NEEDED) {
                g_system.current_state = STATE_SORT_SLOTS;
            } else if (g_system.flags.DISPLAY_UPDATE) {
                g_system.current_state = STATE_DISPLAY;
            }
            break;
            
        case STATE_PROCESS_ENTRY:
            {
                VehicleType_t type = (VehicleType_t)(rand() % 3 + 1);
                char vid[VEHICLE_ID_LEN];
                sprintf(vid, "V%04d", rand() % 10000);
                Process_Entry(type, vid);
                g_system.flags.ENTRY_REQUEST = 0;
                g_system.current_state = STATE_UPDATE_SLOT;
            }
            break;
            
        case STATE_PROCESS_EXIT:
            {
                uint8_t i;
                for (i = 0; i < TOTAL_SLOTS; i++) {
                    if (g_system.slots[i].status == SLOT_OCCUPIED) {
                        Process_Exit(i);
                        break;
                    }
                }
                g_system.flags.EXIT_REQUEST = 0;
                g_system.current_state = STATE_CALC_FEE;
            }
            break;
            
        case STATE_CALC_FEE:
            g_system.flags.FEE_CALCULATED = 1;
            g_system.current_state = STATE_UPDATE_SLOT;
            break;
            
        case STATE_UPDATE_SLOT:
            g_system.flags.SORT_NEEDED = 1;
            g_system.flags.DISPLAY_UPDATE = 1;
            g_system.current_state = STATE_SORT_SLOTS;
            break;
            
        case STATE_SORT_SLOTS:
            Bubble_Sort_Slots();
            g_system.flags.SORT_NEEDED = 0;
            g_system.flags.SORT_COMPLETE = 1;
            g_system.current_state = STATE_DISPLAY;
            break;
            
        case STATE_DISPLAY:
            Dashboard_Update(&g_system);
            g_system.flags.DISPLAY_UPDATE = 0;
            g_system.current_state = STATE_WAIT_INPUT;
            break;
            
        case STATE_ERROR:
            printf("[ERROR] Error code: 0x%02X\\n", g_system.error_code);
            g_system.flags.ERROR_FLAG = 0;
            g_system.error_code = 0;
            g_system.current_state = STATE_WAIT_INPUT;
            break;
            
        case STATE_MAINTENANCE:
            // Handle maintenance mode
            if (!g_system.flags.MAINTENANCE_MODE) {
                g_system.current_state = STATE_WAIT_INPUT;
            }
            break;
            
        case STATE_ANALYTICS:
            Dashboard_Show_Analytics(&g_system);
            g_system.current_state = STATE_WAIT_INPUT;
            break;
            
        case STATE_SHUTDOWN:
            printf("[SYSTEM] Shutting down...\\n");
            g_running = 0;
            break;
            
        default:
            g_system.current_state = STATE_ERROR;
            g_system.error_code = 0xFE;
            break;
    }
}

/*******************************************************************************
 * Process Vehicle Entry
 ******************************************************************************/
void Process_Entry(VehicleType_t type, const char* vehicle_id)
{
    uint8_t slot_idx = 0xFF;
    uint8_t i;
    uint8_t start_idx, end_idx;
    
    // Determine slot range based on vehicle type
    switch (type) {
        case VEHICLE_CAR:
            start_idx = 0;
            end_idx = CAR_SLOTS;
            break;
        case VEHICLE_BIKE:
            start_idx = CAR_SLOTS;
            end_idx = CAR_SLOTS + BIKE_SLOTS;
            break;
        case VEHICLE_TRUCK:
            start_idx = CAR_SLOTS + BIKE_SLOTS;
            end_idx = TOTAL_SLOTS;
            break;
        default:
            g_system.flags.ERROR_FLAG = 1;
            g_system.error_code = 0x01;
            return;
    }
    
    // Find empty slot
    for (i = start_idx; i < end_idx; i++) {
        if (g_system.slots[i].status == SLOT_EMPTY) {
            slot_idx = i;
            break;
        }
    }
    
    if (slot_idx == 0xFF) {
        printf("[ERROR] No empty slot for vehicle type %d\\n", type);
        g_system.flags.ERROR_FLAG = 1;
        g_system.error_code = 0x02;
        return;
    }
    
    // Occupy slot
    g_system.slots[slot_idx].status = SLOT_OCCUPIED;
    g_system.slots[slot_idx].vehicle_type = type;
    g_system.slots[slot_idx].entry_time = g_sim_time;
    strncpy(g_system.slots[slot_idx].vehicle_id, vehicle_id, VEHICLE_ID_LEN - 1);
    
    // Update stats
    g_system.stats.total_entries++;
    g_system.stats.current_occupancy++;
    if (g_system.stats.current_occupancy > g_system.stats.peak_occupancy) {
        g_system.stats.peak_occupancy = g_system.stats.current_occupancy;
    }
    
    switch (type) {
        case VEHICLE_CAR: g_system.stats.car_count++; break;
        case VEHICLE_BIKE: g_system.stats.bike_count++; break;
        case VEHICLE_TRUCK: g_system.stats.truck_count++; break;
        default: break;
    }
    
    // Check if full
    g_system.flags.SLOT_FULL = (g_system.stats.current_occupancy >= TOTAL_SLOTS);
    g_system.flags.SLOT_AVAILABLE = !g_system.flags.SLOT_FULL;
    
    printf("[ENTRY] %s parked at slot %d (Type: %d)\\n", vehicle_id, slot_idx, type);
}

/*******************************************************************************
 * Process Vehicle Exit
 ******************************************************************************/
void Process_Exit(uint8_t slot_id)
{
    uint32_t fee;
    ParkingSlot_t* slot = &g_system.slots[slot_id];
    
    if (slot->status != SLOT_OCCUPIED) {
        g_system.flags.ERROR_FLAG = 1;
        g_system.error_code = 0x03;
        return;
    }
    
    // Calculate fee
    fee = Calculate_Fee(slot->entry_time, g_sim_time, slot->vehicle_type);
    
    printf("[EXIT] %s left slot %d. Fee: $%d\\n", slot->vehicle_id, slot_id, fee);
    
    // Update stats
    g_system.stats.total_exits++;
    g_system.stats.total_revenue += fee;
    g_system.stats.current_occupancy--;
    
    switch (slot->vehicle_type) {
        case VEHICLE_CAR: g_system.stats.car_count--; break;
        case VEHICLE_BIKE: g_system.stats.bike_count--; break;
        case VEHICLE_TRUCK: g_system.stats.truck_count--; break;
        default: break;
    }
    
    // Clear slot
    slot->status = SLOT_EMPTY;
    slot->vehicle_type = VEHICLE_NONE;
    slot->entry_time = 0;
    slot->fee = fee;
    memset(slot->vehicle_id, 0, VEHICLE_ID_LEN);
    
    g_system.flags.SLOT_FULL = 0;
    g_system.flags.SLOT_AVAILABLE = 1;
    g_system.flags.FEE_CALCULATED = 1;
}

/*******************************************************************************
 * Calculate Parking Fee
 ******************************************************************************/
uint32_t Calculate_Fee(uint32_t entry_time, uint32_t exit_time, VehicleType_t type)
{
    uint32_t duration = exit_time - entry_time;
    uint32_t hours = (duration / 36) + 1;  // Simulated hours (36 ticks = 1 hour)
    uint32_t rate;
    
    switch (type) {
        case VEHICLE_CAR: rate = FEE_RATE_CAR; break;
        case VEHICLE_BIKE: rate = FEE_RATE_BIKE; break;
        case VEHICLE_TRUCK: rate = FEE_RATE_TRUCK; break;
        default: rate = FEE_RATE_CAR; break;
    }
    
    return hours * rate;
}

/*******************************************************************************
 * Bubble Sort Implementation
 ******************************************************************************/
void Bubble_Sort_Slots(void)
{
    uint8_t i, j;
    ParkingSlot_t temp;
    uint8_t swapped;
    
    for (i = 0; i < TOTAL_SLOTS - 1; i++) {
        swapped = 0;
        for (j = 0; j < TOTAL_SLOTS - i - 1; j++) {
            // Sort by status (OCCUPIED first, then RESERVED, MAINTENANCE, EMPTY)
            if (g_system.slots[j].status > g_system.slots[j + 1].status) {
                // Swap
                temp = g_system.slots[j];
                g_system.slots[j] = g_system.slots[j + 1];
                g_system.slots[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break;  // Optimization: exit if no swaps
    }
    
    g_system.flags.SORT_COMPLETE = 1;
}

/*******************************************************************************
 * Self-Test Routine
 ******************************************************************************/
void Run_Self_Test(void)
{
    uint8_t i;
    uint8_t test_pass = 1;
    
    printf("[TEST] Running self-test...\\n");
    
    // Test 1: Verify all slots initialized
    for (i = 0; i < TOTAL_SLOTS; i++) {
        if (g_system.slots[i].id != i) {
            printf("[TEST] FAIL: Slot %d ID mismatch\\n", i);
            test_pass = 0;
        }
    }
    
    // Test 2: Verify flags
    if (!g_system.flags.INIT_DONE) {
        printf("[TEST] FAIL: INIT_DONE not set\\n");
        test_pass = 0;
    }
    
    // Test 3: Verify stats reset
    if (g_system.stats.total_entries != 0 || g_system.stats.total_revenue != 0) {
        printf("[TEST] FAIL: Stats not reset\\n");
        test_pass = 0;
    }
    
    g_system.flags.SELF_TEST_PASS = test_pass;
    printf("[TEST] Self-test %s\\n", test_pass ? "PASSED" : "FAILED");
}

/*******************************************************************************
 * Update Debug Variables
 ******************************************************************************/
void Update_Debug_Vars(void)
{
    uint8_t i;
    uint8_t occupied = 0;
    uint8_t empty = 0;
    
    for (i = 0; i < TOTAL_SLOTS; i++) {
        if (g_system.slots[i].status == SLOT_OCCUPIED) occupied++;
        else if (g_system.slots[i].status == SLOT_EMPTY) empty++;
    }
    
    dbg_current_state = g_system.current_state;
    dbg_previous_state = g_system.previous_state;
    dbg_occupied_count = occupied;
    dbg_empty_count = empty;
    dbg_total_revenue = g_system.stats.total_revenue;
    dbg_error_code = g_system.error_code;
    dbg_flags = g_system.flags;
}

/*******************************************************************************
 * Delay Function (Simulated)
 ******************************************************************************/
void Delay_Ms(uint32_t ms)
{
    volatile uint32_t i;
    for (i = 0; i < ms * 1000; i++);
}
`;
}

export function generateParkingSystemH(): string {
  return `/*******************************************************************************
 * Smart Parking Management System - Header File
 * Target: ARM Cortex-M3 (LPC1768)
 ******************************************************************************/

#ifndef PARKING_SYSTEM_H
#define PARKING_SYSTEM_H

#include <stdint.h>

/*******************************************************************************
 * Constants and Macros
 ******************************************************************************/
#define TOTAL_SLOTS     32
#define CAR_SLOTS       16
#define BIKE_SLOTS      10
#define TRUCK_SLOTS     6

#define VEHICLE_ID_LEN  8

#define FEE_RATE_CAR    20
#define FEE_RATE_BIKE   10
#define FEE_RATE_TRUCK  40

/*******************************************************************************
 * Enumerations
 ******************************************************************************/
typedef enum {
    SLOT_EMPTY = 0,
    SLOT_OCCUPIED,
    SLOT_RESERVED,
    SLOT_MAINTENANCE
} SlotStatus_t;

typedef enum {
    VEHICLE_NONE = 0,
    VEHICLE_CAR,
    VEHICLE_BIKE,
    VEHICLE_TRUCK
} VehicleType_t;

typedef enum {
    STATE_IDLE = 0,
    STATE_INIT,
    STATE_SELF_TEST,
    STATE_WAIT_INPUT,
    STATE_PROCESS_ENTRY,
    STATE_PROCESS_EXIT,
    STATE_CALC_FEE,
    STATE_UPDATE_SLOT,
    STATE_SORT_SLOTS,
    STATE_DISPLAY,
    STATE_ERROR,
    STATE_MAINTENANCE,
    STATE_SHUTDOWN,
    STATE_ANALYTICS
} SystemState_t;

/*******************************************************************************
 * Structures
 ******************************************************************************/
typedef struct {
    uint8_t id;
    SlotStatus_t status;
    VehicleType_t vehicle_type;
    uint32_t entry_time;
    uint32_t fee;
    char vehicle_id[VEHICLE_ID_LEN];
} ParkingSlot_t;

typedef struct {
    uint8_t INIT_DONE       : 1;
    uint8_t SLOT_AVAILABLE  : 1;
    uint8_t SLOT_FULL       : 1;
    uint8_t ENTRY_REQUEST   : 1;
    uint8_t EXIT_REQUEST    : 1;
    uint8_t FEE_CALCULATED  : 1;
    uint8_t SORT_NEEDED     : 1;
    uint8_t SORT_COMPLETE   : 1;
    uint8_t ERROR_FLAG      : 1;
    uint8_t MAINTENANCE_MODE: 1;
    uint8_t AUTO_MODE       : 1;
    uint8_t SELF_TEST_PASS  : 1;
    uint8_t DATA_READY      : 1;
    uint8_t DISPLAY_UPDATE  : 1;
} SystemFlags_t;

typedef struct {
    uint32_t total_entries;
    uint32_t total_exits;
    uint32_t total_revenue;
    uint8_t peak_occupancy;
    uint8_t current_occupancy;
    uint8_t car_count;
    uint8_t bike_count;
    uint8_t truck_count;
} SystemStats_t;

typedef struct {
    ParkingSlot_t slots[TOTAL_SLOTS];
    SystemFlags_t flags;
    SystemState_t current_state;
    SystemState_t previous_state;
    SystemStats_t stats;
    uint8_t error_code;
} ParkingSystem_t;

/*******************************************************************************
 * Global Variables (extern)
 ******************************************************************************/
extern volatile ParkingSystem_t g_system;
extern volatile uint32_t g_sim_time;
extern volatile uint8_t g_auto_mode;
extern volatile uint8_t g_running;

// Debug variables
extern volatile SystemState_t dbg_current_state;
extern volatile SystemState_t dbg_previous_state;
extern volatile uint8_t dbg_occupied_count;
extern volatile uint8_t dbg_empty_count;
extern volatile uint32_t dbg_total_revenue;
extern volatile uint8_t dbg_error_code;
extern volatile SystemFlags_t dbg_flags;

#endif /* PARKING_SYSTEM_H */
`;
}

export function generateUiDashboardH(): string {
  return `/*******************************************************************************
 * UI Dashboard Header - Debug Display Functions
 * Target: ARM Cortex-M3 (LPC1768)
 ******************************************************************************/

#ifndef UI_DASHBOARD_H
#define UI_DASHBOARD_H

#include "parking_system.h"

/*******************************************************************************
 * Function Prototypes
 ******************************************************************************/
void Dashboard_Init(void);
void Dashboard_Update(const ParkingSystem_t* system);
void Dashboard_Show_Slots(const ParkingSystem_t* system);
void Dashboard_Show_Stats(const ParkingSystem_t* system);
void Dashboard_Show_Flags(const ParkingSystem_t* system);
void Dashboard_Show_State(const ParkingSystem_t* system);
void Dashboard_Show_Analytics(const ParkingSystem_t* system);
void Dashboard_Clear(void);

#endif /* UI_DASHBOARD_H */
`;
}

export function generateUiDashboardC(): string {
  return `/*******************************************************************************
 * UI Dashboard Implementation - Debug Display Functions
 * Target: ARM Cortex-M3 (LPC1768)
 ******************************************************************************/

#include "ui_dashboard.h"
#include <stdio.h>

/*******************************************************************************
 * State Name Lookup
 ******************************************************************************/
static const char* state_names[] = {
    "IDLE",
    "INIT",
    "SELF_TEST",
    "WAIT_INPUT",
    "PROCESS_ENTRY",
    "PROCESS_EXIT",
    "CALC_FEE",
    "UPDATE_SLOT",
    "SORT_SLOTS",
    "DISPLAY",
    "ERROR",
    "MAINTENANCE",
    "SHUTDOWN",
    "ANALYTICS"
};

static const char* vehicle_types[] = {
    "NONE",
    "CAR",
    "BIKE",
    "TRUCK"
};

static const char* slot_status[] = {
    "EMPTY",
    "OCCUPIED",
    "RESERVED",
    "MAINT"
};

/*******************************************************************************
 * Dashboard Initialization
 ******************************************************************************/
void Dashboard_Init(void)
{
    printf("\\n========================================\\n");
    printf("  SMART PARKING MANAGEMENT SYSTEM\\n");
    printf("  Debug Dashboard v1.0\\n");
    printf("========================================\\n\\n");
}

/*******************************************************************************
 * Dashboard Update - Main Display Refresh
 ******************************************************************************/
void Dashboard_Update(const ParkingSystem_t* system)
{
    Dashboard_Show_State(system);
    Dashboard_Show_Stats(system);
}

/*******************************************************************************
 * Show Slot Grid
 ******************************************************************************/
void Dashboard_Show_Slots(const ParkingSystem_t* system)
{
    uint8_t i;
    
    printf("\\n--- PARKING SLOTS ---\\n");
    printf("CARS (0-15):");
    for (i = 0; i < CAR_SLOTS; i++) {
        if (i % 8 == 0) printf("\\n  ");
        printf("[%02d:%c] ", i, system->slots[i].status == SLOT_OCCUPIED ? 'X' : 
                             system->slots[i].status == SLOT_RESERVED ? 'R' :
                             system->slots[i].status == SLOT_MAINTENANCE ? 'M' : '-');
    }
    
    printf("\\nBIKES (16-25):");
    for (i = CAR_SLOTS; i < CAR_SLOTS + BIKE_SLOTS; i++) {
        if ((i - CAR_SLOTS) % 5 == 0) printf("\\n  ");
        printf("[%02d:%c] ", i, system->slots[i].status == SLOT_OCCUPIED ? 'X' : '-');
    }
    
    printf("\\nTRUCKS (26-31):");
    for (i = CAR_SLOTS + BIKE_SLOTS; i < TOTAL_SLOTS; i++) {
        printf("[%02d:%c] ", i, system->slots[i].status == SLOT_OCCUPIED ? 'X' : '-');
    }
    printf("\\n");
}

/*******************************************************************************
 * Show System Statistics
 ******************************************************************************/
void Dashboard_Show_Stats(const ParkingSystem_t* system)
{
    printf("\\n--- STATISTICS ---\\n");
    printf("Occupancy: %d/%d (Peak: %d)\\n", 
           system->stats.current_occupancy, TOTAL_SLOTS, system->stats.peak_occupancy);
    printf("Entries: %d | Exits: %d\\n", 
           system->stats.total_entries, system->stats.total_exits);
    printf("Revenue: $%d\\n", system->stats.total_revenue);
    printf("Cars: %d | Bikes: %d | Trucks: %d\\n",
           system->stats.car_count, system->stats.bike_count, system->stats.truck_count);
}

/*******************************************************************************
 * Show System Flags
 ******************************************************************************/
void Dashboard_Show_Flags(const ParkingSystem_t* system)
{
    printf("\\n--- FLAGS ---\\n");
    printf("INIT_DONE: %d | SLOT_AVAILABLE: %d | SLOT_FULL: %d\\n",
           system->flags.INIT_DONE, system->flags.SLOT_AVAILABLE, system->flags.SLOT_FULL);
    printf("ENTRY_REQ: %d | EXIT_REQ: %d | FEE_CALC: %d\\n",
           system->flags.ENTRY_REQUEST, system->flags.EXIT_REQUEST, system->flags.FEE_CALCULATED);
    printf("SORT_NEED: %d | SORT_DONE: %d | ERROR: %d\\n",
           system->flags.SORT_NEEDED, system->flags.SORT_COMPLETE, system->flags.ERROR_FLAG);
    printf("AUTO_MODE: %d | SELF_TEST: %d | DATA_RDY: %d\\n",
           system->flags.AUTO_MODE, system->flags.SELF_TEST_PASS, system->flags.DATA_READY);
}

/*******************************************************************************
 * Show Current State
 ******************************************************************************/
void Dashboard_Show_State(const ParkingSystem_t* system)
{
    printf("\\n[STATE] %s -> %s\\n", 
           state_names[system->previous_state], 
           state_names[system->current_state]);
    if (system->error_code != 0) {
        printf("[ERROR] Code: 0x%02X\\n", system->error_code);
    }
}

/*******************************************************************************
 * Show Analytics Report
 ******************************************************************************/
void Dashboard_Show_Analytics(const ParkingSystem_t* system)
{
    float occupancy_rate;
    float avg_fee;
    
    printf("\\n========================================\\n");
    printf("  ANALYTICS REPORT\\n");
    printf("========================================\\n");
    
    occupancy_rate = (float)system->stats.current_occupancy / TOTAL_SLOTS * 100;
    avg_fee = system->stats.total_exits > 0 ? 
              (float)system->stats.total_revenue / system->stats.total_exits : 0;
    
    printf("Current Occupancy Rate: %.1f%%\\n", occupancy_rate);
    printf("Total Revenue: $%d\\n", system->stats.total_revenue);
    printf("Average Fee per Vehicle: $%.2f\\n", avg_fee);
    printf("Peak Occupancy: %d slots\\n", system->stats.peak_occupancy);
    printf("\\nVehicle Distribution:\\n");
    printf("  Cars:   %d (%.1f%%)\\n", system->stats.car_count, 
           system->stats.current_occupancy > 0 ? 
           (float)system->stats.car_count / system->stats.current_occupancy * 100 : 0);
    printf("  Bikes:  %d (%.1f%%)\\n", system->stats.bike_count,
           system->stats.current_occupancy > 0 ? 
           (float)system->stats.bike_count / system->stats.current_occupancy * 100 : 0);
    printf("  Trucks: %d (%.1f%%)\\n", system->stats.truck_count,
           system->stats.current_occupancy > 0 ? 
           (float)system->stats.truck_count / system->stats.current_occupancy * 100 : 0);
    printf("========================================\\n");
}

/*******************************************************************************
 * Clear Dashboard
 ******************************************************************************/
void Dashboard_Clear(void)
{
    printf("\\033[2J\\033[H");  // ANSI escape codes for clear screen
}
`;
}

export function generateAllSourceFiles(): { name: string; content: string; language: string }[] {
  return [
    { name: 'main.c', content: generateMainC(), language: 'c' },
    { name: 'parking_system.h', content: generateParkingSystemH(), language: 'c' },
    { name: 'ui_dashboard.h', content: generateUiDashboardH(), language: 'c' },
    { name: 'ui_dashboard.c', content: generateUiDashboardC(), language: 'c' },
  ];
}

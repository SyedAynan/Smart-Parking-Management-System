'use client';

import { useState } from 'react';
import { useParkingSimulation } from '@/hooks/use-parking-simulation';
import { ParkingSlotGrid } from '@/components/parking-slot-grid';
import { StateMachineView } from '@/components/state-machine-view';
import { FlagsPanel } from '@/components/flags-panel';
import { DebugConsole } from '@/components/debug-console';
import { EventLogView } from '@/components/event-log-view';
import { DataViewPanel } from '@/components/data-view-panel';
import { ControlPanel } from '@/components/control-panel';
import { SourceCodeViewer } from '@/components/source-code-viewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Cpu, Monitor, FileCode, BookOpen, Activity } from 'lucide-react';

export function ParkingDashboard() {
  const {
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
  } = useParkingSimulation();

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const handleSlotClick = (slotId: number) => {
    const slot = state.system.slots[slotId];
    if (slot.status === 'OCCUPIED') {
      manualExit(slotId);
    } else if (slot.status === 'EMPTY' || slot.status === 'MAINTENANCE') {
      toggleMaintenance(slotId);
    }
    setSelectedSlot(slotId);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            Smart Parking Management System
          </h1>
          <p className="text-sm text-muted-foreground">
            ARM Microcontroller Simulation | Keil uVision Debug Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={state.isRunning ? 'default' : 'secondary'} className="font-mono">
            {state.isRunning ? 'RUNNING' : 'STOPPED'}
          </Badge>
          <Badge variant="outline" className="font-mono">
            {state.mode.toUpperCase()} MODE
          </Badge>
          <Badge variant="outline" className="font-mono text-cyan-400">
            T:{state.system.simTime}
          </Badge>
          <Badge
            variant={state.system.flags.ERROR_FLAG ? 'destructive' : 'outline'}
            className="font-mono"
          >
            ERR:0x{state.system.errorCode.toString(16).padStart(2, '0').toUpperCase()}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="simulation" className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 h-10">
          <TabsTrigger value="simulation" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Simulation</span>
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-1">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Debug</span>
          </TabsTrigger>
          <TabsTrigger value="source" className="flex items-center gap-1">
            <FileCode className="h-4 w-4" />
            <span className="hidden sm:inline">Source</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Docs</span>
          </TabsTrigger>
        </TabsList>

        {/* Simulation Tab */}
        <TabsContent value="simulation">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column - Controls */}
            <div className="lg:col-span-3 space-y-4">
              <ControlPanel
                isRunning={state.isRunning}
                speed={state.speed}
                mode={state.mode}
                onStart={start}
                onStop={stop}
                onReset={reset}
                onStepForward={stepForward}
                onSpeedChange={setSpeed}
                onModeChange={setMode}
                onManualEntry={manualEntry}
                onRunSort={runSort}
              />
            </div>

            {/* Center Column - Parking Grid & Events */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="bg-muted/30 border-border">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm">Parking Lot (32 Slots)</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <ParkingSlotGrid
                    slots={state.system.slots}
                    onSlotClick={handleSlotClick}
                    highlightedSlot={selectedSlot}
                  />
                </CardContent>
              </Card>

              <Card className="bg-muted/30 border-border">
                <CardContent className="p-3">
                  <EventLogView events={state.system.eventLog} maxHeight="200px" />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats & State */}
            <div className="lg:col-span-3 space-y-4">
              <DataViewPanel
                stats={state.system.stats}
                slots={state.system.slots}
                simTime={state.system.simTime}
                errorCode={state.system.errorCode}
              />
            </div>
          </div>
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-3">
                  <StateMachineView
                    currentState={state.system.currentState}
                    previousState={state.system.previousState}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4">
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-3">
                  <FlagsPanel flags={state.system.flags} />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4">
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-3">
                  <DebugConsole messages={state.system.debugMessages} maxHeight="400px" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Source Code Tab */}
        <TabsContent value="source">
          <SourceCodeViewer />
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs">
          <DocumentationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentationPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-sm space-y-3">
          <p>
            This Smart Parking Management System simulates an ARM Cortex-M3 microcontroller
            application for managing a 32-slot parking facility.
          </p>
          <div>
            <div className="font-medium mb-1">Key Features:</div>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5 text-xs">
              <li>32 parking slots (16 Cars, 10 Bikes, 6 Trucks)</li>
              <li>Real-time fee calculation based on duration</li>
              <li>Bubble sort algorithm for slot organization</li>
              <li>14-state finite state machine</li>
              <li>Live debug dashboard with flag monitoring</li>
              <li>Manual and automatic simulation modes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Fee Structure</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-1">Vehicle</th>
                <th className="text-left py-1">Slots</th>
                <th className="text-left py-1">Rate/Hour</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr>
                <td className="py-1">Car</td>
                <td>0-15</td>
                <td className="text-yellow-400">$20</td>
              </tr>
              <tr>
                <td className="py-1">Bike</td>
                <td>16-25</td>
                <td className="text-yellow-400">$10</td>
              </tr>
              <tr>
                <td className="py-1">Truck</td>
                <td>26-31</td>
                <td className="text-yellow-400">$40</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">State Machine</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-1">
          <div><span className="text-cyan-400">STATE_IDLE</span> - Initial state</div>
          <div><span className="text-cyan-400">STATE_INIT</span> - System initialization</div>
          <div><span className="text-cyan-400">STATE_SELF_TEST</span> - Diagnostic tests</div>
          <div><span className="text-cyan-400">STATE_WAIT_INPUT</span> - Waiting for events</div>
          <div><span className="text-cyan-400">STATE_PROCESS_ENTRY</span> - Vehicle entry</div>
          <div><span className="text-cyan-400">STATE_PROCESS_EXIT</span> - Vehicle exit</div>
          <div><span className="text-cyan-400">STATE_CALC_FEE</span> - Fee calculation</div>
          <div><span className="text-cyan-400">STATE_UPDATE_SLOT</span> - Update memory</div>
          <div><span className="text-cyan-400">STATE_SORT_SLOTS</span> - Bubble sort</div>
          <div><span className="text-cyan-400">STATE_DISPLAY</span> - Refresh display</div>
          <div><span className="text-red-400">STATE_ERROR</span> - Error handling</div>
          <div><span className="text-orange-400">STATE_MAINTENANCE</span> - Maintenance mode</div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Keil uVision Setup</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>Download all source files from the Source tab</li>
            <li>Create new uVision project targeting LPC1768</li>
            <li>Add main.c, parking_system.h, ui_dashboard.h/c</li>
            <li>Configure for simulator debugging</li>
            <li>Open Debug session and add Watch variables</li>
          </ol>
          <div className="mt-2 p-2 bg-black/30 rounded font-mono">
            Watch Variables:<br />
            g_system, dbg_current_state, dbg_flags,<br />
            dbg_occupied_count, dbg_total_revenue
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-border lg:col-span-2">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Viva Preparation Points</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-medium text-foreground mb-1">Data Structures:</div>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>ParkingSlot_t - Individual slot data</li>
                <li>SystemFlags_t - Bit-packed flags (14 flags)</li>
                <li>SystemStats_t - Analytics counters</li>
                <li>ParkingSystem_t - Main system structure</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Key Algorithms:</div>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Bubble Sort - O(n2) slot sorting</li>
                <li>Linear Search - O(n) empty slot finding</li>
                <li>State Machine - Event-driven architecture</li>
                <li>Fee Calculation - Duration-based pricing</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Memory Concepts:</div>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Volatile keyword for debug variables</li>
                <li>Bit-field structures for flags</li>
                <li>Array-based slot management</li>
                <li>Stack vs heap allocation</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">ARM Specifics:</div>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>Cortex-M3 architecture (32-bit)</li>
                <li>LPC1768 target microcontroller</li>
                <li>Simulator debugging in Keil</li>
                <li>Watch window for real-time monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

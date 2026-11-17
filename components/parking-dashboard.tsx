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
import { AnimatedBarrierGate } from '@/components/animated-barrier-gate';
import { MicrochipBadge } from '@/components/vehicle-visuals';
import { Microchip3DIcon } from '@/components/microchip-3d-icon';
import {
  Occupancy3DIcon,
  RevenueLottieIcon,
  UtilizationLottieIcon,
  GateTrafficLottieIcon,
  CoreAi3DIcon,
} from '@/components/kpi-ribbon-icons';
import { BayTelemetryHud } from '@/components/bay-telemetry-hud';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Cpu, Monitor, Activity, Users, DollarSign, TrendingUp, Clock, ArrowLeftRight } from 'lucide-react';

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

  const handleGenericExit = () => {
    const occupied = state.system.slots.find((s) => s.status === 'OCCUPIED');
    if (occupied) {
      manualExit(occupied.id);
    }
  };

  const occupiedCount = state.system.slots.filter((s) => s.status === 'OCCUPIED').length;
  const occupancyRate = ((state.system.stats.currentOccupancy / 32) * 100).toFixed(1);
  const avgFee = state.system.stats.totalExits > 0 ? (state.system.stats.totalRevenue / state.system.stats.totalExits).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2.5">
            <Microchip3DIcon size={34} className="h-8 w-8" />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent font-extrabold tracking-tight">
              ParkCore
            </span>
            <span className="text-muted-foreground font-normal text-lg">| Smart Parking Simulator</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            ARM Cortex-M3 (LPC1768) · Keil uVision Debug Dashboard · 32-slot state machine
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={state.isRunning ? 'default' : 'secondary'} className="font-mono text-xs">
            {state.isRunning ? 'RUNNING' : 'STOPPED'}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            {state.mode.toUpperCase()} MODE
          </Badge>
          <Badge variant="outline" className="font-mono text-cyan-400 text-xs">
            T:{state.system.simTime}
          </Badge>
          <Badge
            variant={state.system.flags.ERROR_FLAG ? 'destructive' : 'outline'}
            className="font-mono text-xs"
          >
            ERR:0x{state.system.errorCode.toString(16).padStart(2, '0').toUpperCase()}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="simulation" className="space-y-3">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 h-9">
          <TabsTrigger value="simulation" className="flex items-center gap-1 text-xs">
            <Activity className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simulation</span>
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-1 text-xs">
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Debug</span>
          </TabsTrigger>
        </TabsList>

        {/* Simulation Tab */}
        <TabsContent value="simulation" className="space-y-3">
          {/* Top Full-Width KPI Summary Ribbon - Compact & Horizontally Balanced */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {/* Card 1: Occupancy */}
            <Card className="bg-muted/30 border-border">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Occupancy3DIcon className="w-[34px] h-[34px]" />
                    <span className="text-[11px] text-muted-foreground font-medium">Occupancy</span>
                  </div>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-sm font-bold text-cyan-300">{state.system.stats.currentOccupancy}</span>
                    <span className="text-[9.5px] text-muted-foreground">/ 32</span>
                  </div>
                </div>
                <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(state.system.stats.currentOccupancy / 32) * 100}%` }}
                  />
                </div>
                <div className="mt-1 text-[8.5px] text-muted-foreground font-mono flex items-center justify-between">
                  <span>{32 - state.system.stats.currentOccupancy} Available</span>
                  <span className="text-cyan-400/80 font-bold">SLOTS READY</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Total Revenue */}
            <Card className="bg-muted/30 border-border">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RevenueLottieIcon className="w-[34px] h-[34px]" />
                    <span className="text-[11px] text-muted-foreground font-medium">Revenue</span>
                  </div>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-sm font-bold text-amber-300">${state.system.stats.totalRevenue}</span>
                    <span className="text-[9px] text-muted-foreground font-normal">USD</span>
                  </div>
                </div>
                <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (state.system.stats.totalRevenue / 500) * 100)}%` }}
                  />
                </div>
                <div className="mt-1 text-[8.5px] text-muted-foreground font-mono flex items-center justify-between">
                  <span>Avg ${avgFee}/exit</span>
                  <span className="text-amber-400/90 font-bold">CASH CLEAR</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Utilization */}
            <Card className="bg-muted/30 border-border">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UtilizationLottieIcon className="w-[34px] h-[34px]" />
                    <span className="text-[11px] text-muted-foreground font-medium">Utilization</span>
                  </div>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-sm font-bold text-emerald-300">{occupancyRate}%</span>
                  </div>
                </div>
                <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(state.system.stats.currentOccupancy / 32) * 100}%` }}
                  />
                </div>
                <div className="mt-1 text-[8.5px] text-muted-foreground font-mono flex items-center justify-between">
                  <span>Active Load</span>
                  <span className="text-emerald-400/80 font-bold">OPTIMAL</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: 2-Way Gate Plaza Traffic */}
            <Card className="bg-muted/30 border-border">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GateTrafficLottieIcon className="w-[46px] h-[26px]" />
                    <span className="text-[11px] text-muted-foreground font-medium">Gate Traffic</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9.5px] font-mono">
                    <span className="text-cyan-400 font-bold">➔{state.system.stats.totalEntries}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-purple-400 font-bold">{state.system.stats.totalExits}⬅</span>
                  </div>
                </div>
                <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1 overflow-hidden flex">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{
                      width: `${
                        state.system.stats.totalEntries + state.system.stats.totalExits > 0
                          ? (state.system.stats.totalEntries /
                              (state.system.stats.totalEntries + state.system.stats.totalExits)) *
                            100
                          : 50
                      }%`,
                    }}
                  />
                  <div
                    className="bg-purple-400 h-full transition-all duration-300"
                    style={{
                      width: `${
                        state.system.stats.totalEntries + state.system.stats.totalExits > 0
                          ? (state.system.stats.totalExits /
                              (state.system.stats.totalEntries + state.system.stats.totalExits)) *
                            100
                          : 50
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[8.5px] text-slate-400 font-mono flex items-center justify-between">
                  <span>2-Way Dual-Flow</span>
                  <span className="text-purple-400 font-bold">ACTIVE</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 5: ARM Cortex-M3 Core State */}
            <Card className="bg-muted/30 border-border col-span-2 md:col-span-1">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CoreAi3DIcon className="w-[34px] h-[34px]" />
                    <span className="text-[11px] text-muted-foreground font-medium">LPC1768 Core</span>
                  </div>
                  <span className="text-[10px] font-bold font-mono text-sky-300 truncate max-w-[85px]">
                    {state.system.currentState.replace('STATE_', '')}
                  </span>
                </div>
                <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full animate-pulse w-full" />
                </div>
                <div className="mt-1 text-[8.5px] text-muted-foreground font-mono flex items-center justify-between">
                  <span>Tick: T:{state.system.simTime}s</span>
                  <span className="text-emerald-400 font-bold">PWM ACTIVE</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main 3-Column Synchronized Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left Column - Controls, Vehicle Dispatch & Hardware HUD */}
            <div className="lg:col-span-3 space-y-3">
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
                onManualExit={handleGenericExit}
                occupiedCount={occupiedCount}
                onRunSort={runSort}
              />

              {/* Hardware Peripherals & Bay Inspector HUD - Anchors the Left Column height */}
              <BayTelemetryHud
                slot={selectedSlot !== null ? state.system.slots[selectedSlot] : null}
                simTime={state.system.simTime}
                onExitSlot={manualExit}
                onToggleMaintenance={toggleMaintenance}
              />
            </div>

            {/* Center Column - 2-Way Gate Plaza & 32 Slots */}
            <div className="lg:col-span-6 space-y-3">
              <AnimatedBarrierGate
                currentState={state.system.currentState}
                lastEvent={state.system.eventLog[state.system.eventLog.length - 1]}
                simTime={state.system.simTime}
                slots={state.system.slots}
                onDispatchEntry={manualEntry}
                onDispatchExit={manualExit}
              />

              <Card className="bg-muted/30 border-border">
                <CardHeader className="p-2.5 pb-1 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-semibold">Parking Lot (32 Slots)</CardTitle>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {occupiedCount} / 32 Occupied · {32 - occupiedCount} Available
                  </div>
                </CardHeader>
                <CardContent className="p-2.5 pt-0">
                  <ParkingSlotGrid
                    slots={state.system.slots}
                    onSlotClick={handleSlotClick}
                    highlightedSlot={state.activeTransitSlot !== null ? state.activeTransitSlot : selectedSlot}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Live Event Log & Hardware Diagnostics */}
            <div className="lg:col-span-3 space-y-2.5">
              {/* Real-time Hardware Event Stream */}
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-2">
                  <EventLogView events={state.system.eventLog} maxHeight="140px" />
                </CardContent>
              </Card>

              {/* Vehicle Distribution, Session Analytics & Register Dump */}
              <DataViewPanel
                stats={state.system.stats}
                slots={state.system.slots}
                simTime={state.system.simTime}
                errorCode={state.system.errorCode}
                showStatsGrid={false}
                currentState={state.system.currentState}
                flags={state.system.flags}
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
      </Tabs>
    </div>
  );
}

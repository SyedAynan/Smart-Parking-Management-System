'use client';

import React from 'react';
import { SystemState, ParkingEvent, VehicleType } from '@/lib/parking-system';
import { VehicleVisual } from '@/components/vehicle-visuals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Radio, ShieldAlert } from 'lucide-react';

interface AnimatedBarrierGateProps {
  currentState: SystemState;
  lastEvent?: ParkingEvent;
  simTime: number;
}

export function AnimatedBarrierGate({ currentState, lastEvent, simTime }: AnimatedBarrierGateProps) {
  const isEntry = currentState === 'STATE_PROCESS_ENTRY';
  const isExit = currentState === 'STATE_PROCESS_EXIT';
  const isOpen = isEntry || isExit;
  const isMaintenance = currentState === 'STATE_MAINTENANCE';
  const isError = currentState === 'STATE_ERROR';

  // Active vehicle from recent event
  const activeVehicleType: VehicleType | null =
    isOpen && lastEvent?.vehicleType ? lastEvent.vehicleType : isEntry ? 'CAR' : null;
  const activeVehicleId = lastEvent?.vehicleId || (isOpen ? 'PARK-TEMP' : null);

  return (
    <Card className="bg-card/60 border-border overflow-hidden">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <Radio className={cn('h-4 w-4', isOpen ? 'text-emerald-400 animate-pulse' : 'text-cyan-400')} />
          <CardTitle className="text-xs font-semibold uppercase tracking-wider">
            Smart Boom Barrier & Entry Sensor
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={isOpen ? 'default' : isError ? 'destructive' : 'secondary'}
            className={cn(
              'font-mono text-[10px] tracking-wide',
              isOpen && 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
            )}
          >
            {isOpen ? 'BARRIER OPEN (90°)' : isError ? 'FAULT DETECTED' : isMaintenance ? 'MAINTENANCE' : 'BARRIER DOWN (0°)'}
          </Badge>
          <span className="text-[10px] font-mono text-muted-foreground">T:{simTime}</span>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Barrier Graphic Area (7 Cols) */}
          <div className="md:col-span-8 bg-black/40 rounded-lg p-3 border border-border/40 relative min-h-[110px] flex items-end justify-between overflow-hidden">
            {/* Background Lane & Sensors */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-muted/20 border-t border-dashed border-border/50 flex items-center justify-around px-4">
              <span className="text-[8px] font-mono text-muted-foreground">IR_BEAM_ENTRY: {isEntry ? 'TRIGGERED' : 'CLEAR'}</span>
              <span className="text-[8px] font-mono text-muted-foreground">IR_BEAM_EXIT: {isExit ? 'TRIGGERED' : 'CLEAR'}</span>
            </div>

            {/* Left Stanchion / Bollard + Traffic Light */}
            <div className="relative flex flex-col items-center z-10">
              {/* Traffic Light Housing */}
              <div className="bg-neutral-900 border border-neutral-700 rounded-full px-1 py-1.5 flex flex-col gap-1 mb-1 shadow-md">
                {/* Red Light */}
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    isOpen ? 'bg-red-950 opacity-40' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  )}
                />
                {/* Green Light */}
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    isOpen ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-emerald-950 opacity-40'
                  )}
                />
              </div>

              {/* Bollard Post Base */}
              <div className="w-7 h-14 bg-gradient-to-t from-slate-800 to-slate-600 rounded-t-sm border border-slate-500 relative flex items-center justify-center">
                {/* Pivot Joint */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-yellow-400 z-20" />

                {/* Animated Barrier Arm */}
                <div
                  className={cn(
                    'absolute left-4 w-44 h-2.5 rounded-r origin-left transition-transform duration-700 ease-out z-10',
                    'shadow-lg flex overflow-hidden border border-yellow-500/40'
                  )}
                  style={{
                    transform: isOpen ? 'rotate(-72deg)' : 'rotate(0deg)',
                    background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 8px, #ffffff 8px, #ffffff 16px)',
                  }}
                >
                  {/* Tip LED */}
                  <div
                    className={cn(
                      'ml-auto mr-1 w-1.5 h-1.5 rounded-full my-auto',
                      isOpen ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500'
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Passing Vehicle Visualization */}
            <div className="relative flex-1 flex flex-col items-center justify-center pb-2 z-10 min-h-[60px]">
              {isOpen && activeVehicleType ? (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-left-6 duration-500">
                  <VehicleVisual type={activeVehicleType} className="h-8 w-16" isAnimated={true} />
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[9px] font-mono bg-cyan-950/60 text-cyan-300 border-cyan-700/50">
                      ID: {activeVehicleId}
                    </Badge>
                    <Badge variant="secondary" className="text-[9px] font-mono text-emerald-400">
                      {isEntry ? 'ACCESS GRANTED' : 'PAID & EXITING'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground/60 text-[10px] font-mono py-2">
                  [LPC1768 SENSOR READY · LANE STANDBY]
                </div>
              )}
            </div>

            {/* Right Lane Receiver Post */}
            <div className="w-4 h-12 bg-slate-700 rounded-t-sm border border-slate-600 opacity-60 z-10" />
          </div>

          {/* Telemetry Readout (4 Cols) */}
          <div className="md:col-span-4 space-y-1.5 bg-muted/20 p-2.5 rounded-lg border border-border/50 text-[11px]">
            <div className="flex justify-between items-center text-muted-foreground pb-1 border-b border-border/40">
              <span className="font-medium">LPC1768 GPIO/Servo</span>
              <span className="font-mono text-cyan-400">{isOpen ? 'SERVO: 90°' : 'SERVO: 0°'}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground text-[10px]">Gate Status:</span>
              <span className={cn('font-mono font-medium text-[10px]', isOpen ? 'text-emerald-400' : 'text-slate-300')}>
                {isOpen ? (isEntry ? 'ENTRY SCAN OPEN' : 'EXIT BILLING OPEN') : isMaintenance ? 'MAINTENANCE' : 'LOCKED CLOSED'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground text-[10px]">Active Rate Tier:</span>
              <span className="font-mono text-yellow-400 text-[10px]">
                {activeVehicleType === 'CAR' ? 'CAR ($20/h)' : activeVehicleType === 'BIKE' ? 'BIKE ($10/h)' : activeVehicleType === 'TRUCK' ? 'TRUCK ($40/h)' : 'AUTO DETECT'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-muted-foreground text-[10px]">Optical Sensor:</span>
              <span className="font-mono text-[10px] text-cyan-300">
                {isOpen ? 'OBJECT DETECTED' : 'CLEAR'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

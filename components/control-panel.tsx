'use client';

import { VehicleType } from '@/lib/parking-system';
import { VehicleVisual } from '@/components/vehicle-visuals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Car,
  Bike,
  Truck,
  Zap,
  Hand,
  ArrowUpDown,
  Settings,
  LogOut,
} from 'lucide-react';

interface ControlPanelProps {
  isRunning: boolean;
  speed: number;
  mode: 'manual' | 'auto';
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onSpeedChange: (speed: number) => void;
  onModeChange: (mode: 'manual' | 'auto') => void;
  onManualEntry: (type: VehicleType) => void;
  onManualExit?: () => void;
  occupiedCount?: number;
  onRunSort: () => void;
}

export function ControlPanel({
  isRunning,
  speed,
  mode,
  onStart,
  onStop,
  onReset,
  onStepForward,
  onSpeedChange,
  onModeChange,
  onManualEntry,
  onManualExit,
  occupiedCount = 0,
  onRunSort,
}: ControlPanelProps) {
  return (
    <div className="space-y-2.5">
      {/* Simulation Controls */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5 text-cyan-400" />
            <span>Simulation Controls</span>
          </CardTitle>
          <span className="text-[9px] font-mono text-cyan-400">{speed}ms</span>
        </CardHeader>
        <CardContent className="p-2 pt-0 space-y-1.5">
          {/* Play/Pause/Reset */}
          <div className="flex gap-1.5">
            {isRunning ? (
              <Button size="sm" variant="destructive" onClick={onStop} className="flex-1 h-6 text-xs">
                <Pause className="h-3.5 w-3.5 mr-1" />
                Pause
              </Button>
            ) : (
              <Button size="sm" onClick={onStart} className="flex-1 h-6 text-xs bg-emerald-600 hover:bg-emerald-700">
                <Play className="h-3.5 w-3.5 mr-1" />
                Start
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onStepForward} disabled={isRunning} className="h-6 w-6 p-0">
              <StepForward className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={onReset} className="h-6 w-6 p-0">
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>

          {/* Speed Slider & Mode Toggle */}
          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex-1">
              <Slider
                value={[speed]}
                onValueChange={([v]) => onSpeedChange(v)}
                min={100}
                max={2000}
                step={100}
                className="w-full"
              />
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={mode === 'manual' ? 'default' : 'outline'}
                onClick={() => onModeChange('manual')}
                className="h-5 text-[9.5px] px-2"
              >
                Manual
              </Button>
              <Button
                size="sm"
                variant={mode === 'auto' ? 'default' : 'outline'}
                onClick={() => onModeChange('auto')}
                className="h-5 text-[9.5px] px-2"
              >
                Auto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Dispatch Controls - Operator Central Console */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold">Operator Dispatch Console</CardTitle>
          <span className="text-[9px] font-mono text-cyan-400">CENTRAL</span>
        </CardHeader>
        <CardContent className="p-2 pt-0 space-y-1.5">
          <div className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider">
            Inbound Fleet Dispatch
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onManualEntry('CAR')}
              className="h-6 text-[9.5px] px-1 flex items-center justify-center gap-1 hover:border-cyan-500"
            >
              <VehicleVisual type="CAR" className="h-2.5 w-4" />
              <span>Car ($20)</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onManualEntry('BIKE')}
              className="h-6 text-[9.5px] px-1 flex items-center justify-center gap-1 hover:border-emerald-500"
            >
              <VehicleVisual type="BIKE" className="h-2.5 w-4" />
              <span>Bike ($10)</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onManualEntry('TRUCK')}
              className="h-6 text-[9.5px] px-1 flex items-center justify-center gap-1 hover:border-amber-500"
            >
              <VehicleVisual type="TRUCK" className="h-2.5 w-4" />
              <span>Truck ($40)</span>
            </Button>
          </div>

          <div className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider pt-0.5 border-t border-border/40">
            Outbound & Lot Operations
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={occupiedCount === 0 || !onManualExit}
              onClick={onManualExit}
              className="h-6 text-[9px] px-1.5 bg-purple-950/20 hover:bg-purple-900/40 border-purple-800/50 text-purple-300 flex items-center justify-center gap-1"
            >
              <LogOut className="h-2.5 w-2.5 text-purple-400" />
              <span>Clear Exit ({occupiedCount})</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRunSort}
              className="h-6 text-[9px] px-1.5 hover:border-yellow-500/60 flex items-center justify-center gap-1"
            >
              <ArrowUpDown className="h-2.5 w-2.5 text-yellow-400" />
              <span>Sort O(n²)</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

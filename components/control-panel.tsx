'use client';

import { VehicleType } from '@/lib/parking-system';
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
  onRunSort,
}: ControlPanelProps) {
  return (
    <div className="space-y-4">
      {/* Simulation Controls */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Simulation Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          {/* Play/Pause/Reset */}
          <div className="flex gap-2">
            {isRunning ? (
              <Button size="sm" variant="destructive" onClick={onStop} className="flex-1">
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            ) : (
              <Button size="sm" onClick={onStart} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onStepForward} disabled={isRunning}>
              <StepForward className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Speed</span>
              <span className="font-mono">{speed}ms</span>
            </div>
            <Slider
              value={[speed]}
              onValueChange={([v]) => onSpeedChange(v)}
              min={100}
              max={2000}
              step={100}
              className="w-full"
            />
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === 'manual' ? 'default' : 'outline'}
              onClick={() => onModeChange('manual')}
              className="flex-1"
            >
              <Hand className="h-4 w-4 mr-1" />
              Manual
            </Button>
            <Button
              size="sm"
              variant={mode === 'auto' ? 'default' : 'outline'}
              onClick={() => onModeChange('auto')}
              className="flex-1"
            >
              <Zap className="h-4 w-4 mr-1" />
              Auto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry Controls */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Manual Entry</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onManualEntry('CAR')}
            className="w-full justify-start"
          >
            <Car className="h-4 w-4 mr-2 text-blue-400" />
            Park Car ($20/hr)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onManualEntry('BIKE')}
            className="w-full justify-start"
          >
            <Bike className="h-4 w-4 mr-2 text-green-400" />
            Park Bike ($10/hr)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onManualEntry('TRUCK')}
            className="w-full justify-start"
          >
            <Truck className="h-4 w-4 mr-2 text-purple-400" />
            Park Truck ($40/hr)
          </Button>
        </CardContent>
      </Card>

      {/* Sort Control */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Operations</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <Button size="sm" variant="outline" onClick={onRunSort} className="w-full">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Run Bubble Sort
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-[10px] text-muted-foreground space-y-1 p-2 bg-muted/20 rounded">
        <div className="font-medium text-foreground">Quick Guide:</div>
        <div>- Click slots to exit vehicles or toggle maintenance</div>
        <div>- Use Manual mode for step-by-step control</div>
        <div>- Auto mode simulates random entry/exit events</div>
        <div>- Watch the state machine and flags update in real-time</div>
      </div>
    </div>
  );
}

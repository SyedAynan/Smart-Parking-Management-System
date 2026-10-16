'use client';

import { SystemState, STATE_DESCRIPTIONS } from '@/lib/parking-system';
import { cn } from '@/lib/utils';

interface StateMachineViewProps {
  currentState: SystemState;
  previousState: SystemState;
}

const ALL_STATES: SystemState[] = [
  'STATE_IDLE',
  'STATE_INIT',
  'STATE_SELF_TEST',
  'STATE_WAIT_INPUT',
  'STATE_PROCESS_ENTRY',
  'STATE_PROCESS_EXIT',
  'STATE_CALC_FEE',
  'STATE_UPDATE_SLOT',
  'STATE_SORT_SLOTS',
  'STATE_DISPLAY',
  'STATE_ERROR',
  'STATE_MAINTENANCE',
  'STATE_ANALYTICS',
  'STATE_SHUTDOWN',
];

function getStateColor(state: SystemState, isActive: boolean, isPrevious: boolean): string {
  if (isActive) {
    if (state === 'STATE_ERROR') return 'bg-red-500 text-white';
    if (state === 'STATE_MAINTENANCE') return 'bg-orange-500 text-white';
    return 'bg-emerald-500 text-white';
  }
  if (isPrevious) return 'bg-blue-500/50 text-blue-100';
  return 'bg-muted text-muted-foreground';
}

export function StateMachineView({ currentState, previousState }: StateMachineViewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">STATE MACHINE</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Current:</span>
          <span className="text-xs font-mono text-emerald-400">{currentState.replace('STATE_', '')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {ALL_STATES.map((state) => {
          const isActive = state === currentState;
          const isPrevious = state === previousState && !isActive;

          return (
            <div
              key={state}
              className={cn(
                'px-2 py-1.5 rounded text-[10px] font-mono transition-all',
                getStateColor(state, isActive, isPrevious),
                isActive && 'ring-2 ring-white/50 scale-105'
              )}
            >
              <div className="font-semibold">{state.replace('STATE_', '')}</div>
            </div>
          );
        })}
      </div>

      {/* Current State Description */}
      <div className="p-2 bg-muted/50 rounded border border-border">
        <div className="text-[10px] text-muted-foreground mb-1">Description:</div>
        <div className="text-xs">{STATE_DESCRIPTIONS[currentState]}</div>
      </div>

      {/* State Transition */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Transition:</span>
        <span className="font-mono text-blue-400">{previousState.replace('STATE_', '')}</span>
        <span className="text-muted-foreground">→</span>
        <span className="font-mono text-emerald-400">{currentState.replace('STATE_', '')}</span>
      </div>
    </div>
  );
}

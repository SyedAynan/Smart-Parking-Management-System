'use client';

import { useEffect, useRef } from 'react';
import { ParkingEvent } from '@/lib/parking-system';
import { cn } from '@/lib/utils';
import { LogIn, LogOut, DollarSign, AlertCircle, Settings, ArrowUpDown, Info } from 'lucide-react';

interface EventLogViewProps {
  events: ParkingEvent[];
  maxHeight?: string;
}

function getEventIcon(type: ParkingEvent['type']) {
  switch (type) {
    case 'ENTRY':
      return <LogIn className="h-3 w-3 text-emerald-400" />;
    case 'EXIT':
      return <LogOut className="h-3 w-3 text-blue-400" />;
    case 'FEE':
      return <DollarSign className="h-3 w-3 text-yellow-400" />;
    case 'ERROR':
      return <AlertCircle className="h-3 w-3 text-red-400" />;
    case 'MAINTENANCE':
      return <Settings className="h-3 w-3 text-orange-400" />;
    case 'SORT':
      return <ArrowUpDown className="h-3 w-3 text-purple-400" />;
    default:
      return <Info className="h-3 w-3 text-muted-foreground" />;
  }
}

function getEventColor(type: ParkingEvent['type']): string {
  switch (type) {
    case 'ENTRY':
      return 'border-l-emerald-500';
    case 'EXIT':
      return 'border-l-blue-500';
    case 'FEE':
      return 'border-l-yellow-500';
    case 'ERROR':
      return 'border-l-red-500';
    case 'MAINTENANCE':
      return 'border-l-orange-500';
    case 'SORT':
      return 'border-l-purple-500';
    default:
      return 'border-l-muted-foreground';
  }
}

export function EventLogView({ events, maxHeight = '300px' }: EventLogViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">EVENT LOG</span>
        <span className="text-[10px] text-muted-foreground">{events.length} events</span>
      </div>

      <div ref={scrollRef} className="space-y-1 overflow-auto" style={{ maxHeight }}>
        {events.length === 0 ? (
          <div className="text-xs text-muted-foreground p-2">No events recorded yet...</div>
        ) : (
          events.map((event, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-2 p-2 bg-muted/30 rounded border-l-2',
                getEventColor(event.type)
              )}
            >
              <div className="mt-0.5">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    T:{event.timestamp}
                  </span>
                  <span className="text-[10px] font-medium">{event.type}</span>
                  {event.slotId !== undefined && (
                    <span className="text-[10px] text-cyan-400">Slot:{event.slotId}</span>
                  )}
                </div>
                <div className="text-xs text-foreground/80 truncate">{event.message}</div>
                {event.fee !== undefined && (
                  <div className="text-xs text-yellow-400 font-mono">${event.fee}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

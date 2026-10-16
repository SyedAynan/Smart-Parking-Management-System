'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DebugConsoleProps {
  messages: string[];
  maxHeight?: string;
}

export function DebugConsole({ messages, maxHeight = '200px' }: DebugConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">DEBUG CONSOLE</span>
        <span className="text-[10px] text-muted-foreground">{messages.length} messages</span>
      </div>
      
      <div
        ref={scrollRef}
        className="bg-black/50 rounded border border-border p-2 font-mono text-[11px] overflow-auto"
        style={{ maxHeight }}
      >
        {messages.length === 0 ? (
          <div className="text-muted-foreground">No debug messages yet...</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'py-0.5',
                msg.includes('ERROR') && 'text-red-400',
                msg.includes('PASS') && 'text-emerald-400',
                msg.includes('State:') && 'text-cyan-400',
                msg.includes('Fee:') && 'text-yellow-400',
                !msg.includes('ERROR') &&
                  !msg.includes('PASS') &&
                  !msg.includes('State:') &&
                  !msg.includes('Fee:') &&
                  'text-foreground/80'
              )}
            >
              {msg}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

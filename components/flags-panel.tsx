'use client';

import { SystemFlags } from '@/lib/parking-system';
import { cn } from '@/lib/utils';

interface FlagsPanelProps {
  flags: SystemFlags;
}

const FLAG_GROUPS = [
  {
    title: 'System',
    flags: ['INIT_DONE', 'SELF_TEST_PASS', 'DATA_READY', 'AUTO_MODE'] as const,
  },
  {
    title: 'Slots',
    flags: ['SLOT_AVAILABLE', 'SLOT_FULL', 'MAINTENANCE_MODE'] as const,
  },
  {
    title: 'Operations',
    flags: ['ENTRY_REQUEST', 'EXIT_REQUEST', 'FEE_CALCULATED'] as const,
  },
  {
    title: 'Sort/Display',
    flags: ['SORT_NEEDED', 'SORT_COMPLETE', 'DISPLAY_UPDATE', 'ERROR_FLAG'] as const,
  },
];

export function FlagsPanel({ flags }: FlagsPanelProps) {
  return (
    <div className="space-y-3">
      <span className="text-xs font-medium text-muted-foreground">SYSTEM FLAGS</span>

      {FLAG_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1">
          <div className="text-[10px] text-muted-foreground uppercase">{group.title}</div>
          <div className="grid grid-cols-2 gap-1">
            {group.flags.map((flagName) => {
              const value = flags[flagName];
              return (
                <div
                  key={flagName}
                  className={cn(
                    'flex items-center justify-between px-2 py-1 rounded text-[10px] font-mono',
                    value ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <span className="truncate">{flagName.replace(/_/g, ' ')}</span>
                  <span
                    className={cn(
                      'font-bold',
                      value ? 'text-emerald-400' : 'text-muted-foreground'
                    )}
                  >
                    {value ? '1' : '0'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Binary representation */}
      <div className="pt-2 border-t border-border">
        <div className="text-[10px] text-muted-foreground mb-1">FLAGS (Binary):</div>
        <div className="font-mono text-xs text-cyan-400 break-all">
          0b
          {Object.values(flags)
            .map((v) => (v ? '1' : '0'))
            .join('')}
        </div>
      </div>
    </div>
  );
}

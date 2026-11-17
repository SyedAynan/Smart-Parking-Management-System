'use client';

import { SystemStats, ParkingSlot, SystemState, SystemFlags } from '@/lib/parking-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Bike, Truck, DollarSign, TrendingUp, Users, Clock, Terminal } from 'lucide-react';

interface DataViewPanelProps {
  stats: SystemStats;
  slots: ParkingSlot[];
  simTime: number;
  errorCode: number;
  showStatsGrid?: boolean;
  currentState?: SystemState;
  flags?: SystemFlags;
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

export function DataViewPanel({
  stats,
  slots,
  simTime,
  errorCode,
  showStatsGrid = true,
  currentState,
  flags,
}: DataViewPanelProps) {
  const occupancyRate = ((stats.currentOccupancy / 32) * 100).toFixed(1);
  const avgFee = stats.totalExits > 0 ? (stats.totalRevenue / stats.totalExits).toFixed(2) : '0.00';

  const flagBits = flags
    ? (flags.INIT_DONE ? 1 << 0 : 0) |
      (flags.SLOT_AVAILABLE ? 1 << 1 : 0) |
      (flags.SLOT_FULL ? 1 << 2 : 0) |
      (flags.ENTRY_REQUEST ? 1 << 3 : 0) |
      (flags.EXIT_REQUEST ? 1 << 4 : 0) |
      (flags.FEE_CALCULATED ? 1 << 5 : 0) |
      (flags.AUTO_MODE ? 1 << 6 : 0) |
      (flags.ERROR_FLAG ? 1 << 7 : 0)
    : 0x0001;

  const stateIndex = currentState ? Math.max(0, ALL_STATES.indexOf(currentState)) : 3;

  return (
    <div className="space-y-2.5">
      {/* Optional Top Stats Grid */}
      {showStatsGrid && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <div>
                  <div className="text-lg font-bold">{stats.currentOccupancy}/32</div>
                  <div className="text-[10px] text-muted-foreground">Occupancy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <div>
                  <div className="text-lg font-bold">${stats.totalRevenue}</div>
                  <div className="text-[10px] text-muted-foreground">Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-lg font-bold">{occupancyRate}%</div>
                  <div className="text-[10px] text-muted-foreground">Utilization</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border">
            <CardContent className="p-2.5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <div>
                  <div className="text-lg font-bold">{simTime}</div>
                  <div className="text-[10px] text-muted-foreground">Sim Ticks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vehicle Breakdown */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-2.5 pb-1.5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold">Vehicle Distribution</CardTitle>
          <span className="text-[9.5px] font-mono text-muted-foreground">{stats.currentOccupancy} / 32</span>
        </CardHeader>
        <CardContent className="p-2.5 pt-0">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <Car className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-bold text-[11px] font-mono">{stats.carCount}/16</span>
              </div>
              <span className="text-[9px] text-muted-foreground">Cars ($20)</span>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-0.5 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(stats.carCount / 16) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <Bike className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-bold text-[11px] font-mono">{stats.bikeCount}/10</span>
              </div>
              <span className="text-[9px] text-muted-foreground">Bikes ($10)</span>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-0.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(stats.bikeCount / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-bold text-[11px] font-mono">{stats.truckCount}/6</span>
              </div>
              <span className="text-[9px] text-muted-foreground">Trucks ($40)</span>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-0.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(stats.truckCount / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Table - Compact 2-Column Topology */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold">Analytics</CardTitle>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.2 rounded">
            ERR: 0x{errorCode.toString(16).padStart(2, '0').toUpperCase()}
          </span>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="grid grid-cols-2 gap-1 text-[9.5px] font-mono">
            <div className="bg-slate-900/70 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
              <span className="text-muted-foreground">Entries</span>
              <span className="font-bold text-cyan-300">{stats.totalEntries}</span>
            </div>
            <div className="bg-slate-900/70 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
              <span className="text-muted-foreground">Exits</span>
              <span className="font-bold text-purple-300">{stats.totalExits}</span>
            </div>
            <div className="bg-slate-900/70 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
              <span className="text-muted-foreground">Peak Load</span>
              <span className="font-bold text-slate-200">{stats.peakOccupancy} / 32</span>
            </div>
            <div className="bg-slate-900/70 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
              <span className="text-muted-foreground">Avg Fee</span>
              <span className="font-bold text-amber-300">${avgFee}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory View (Keil uVision Register Dump) - Compacted & Brought Upward */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-cyan-400" />
            <span>Memory View (g_system)</span>
          </CardTitle>
          <span className="text-[8.5px] font-mono text-slate-500">0x20000000 SRAM</span>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <div className="font-mono text-[9px] text-cyan-400 bg-black/40 border border-slate-800 p-1.5 rounded overflow-x-auto leading-normal space-y-0.5">
            <div className="flex justify-between items-center">
              <span>slots[32] @ 0x20000000</span>
              <span className="text-slate-400 text-[8.5px]">{stats.currentOccupancy}/32 active</span>
            </div>
            <div className="flex justify-between items-center">
              <span>flags @ 0x20000400</span>
              <span className="text-emerald-400 font-bold">0x{flagBits.toString(16).padStart(4, '0').toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="truncate">current_state @ 0x20000404</span>
              <span className="text-sky-300 font-bold">0x{stateIndex.toString(16).padStart(2, '0').toUpperCase()} ({currentState ? currentState.replace('STATE_', '') : 'WAIT_INPUT'})</span>
            </div>
            <div className="pt-1 mt-0.5 border-t border-slate-800/80 flex justify-between items-center text-[8.5px]">
              <span className="text-slate-400">in: {stats.totalEntries} · out: {stats.totalExits}</span>
              <span className="text-amber-300 font-bold">${stats.totalRevenue} rev</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

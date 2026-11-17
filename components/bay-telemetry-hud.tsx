'use client';

import React from 'react';
import { ParkingSlot } from '@/lib/parking-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Radio, ShieldCheck, Zap, Wrench, LogOut, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BayTelemetryHudProps {
  slot: ParkingSlot | null;
  simTime: number;
  onExitSlot?: (slotId: number) => void;
  onToggleMaintenance?: (slotId: number) => void;
}

export function BayTelemetryHud({
  slot,
  simTime,
  onExitSlot,
  onToggleMaintenance,
}: BayTelemetryHudProps) {
  // If a slot is clicked or active, show Bay Hardware & RFID Inspector
  if (slot) {
    const isOccupied = slot.status === 'OCCUPIED';
    const isMaintenance = slot.status === 'MAINTENANCE';
    const duration = slot.entryTime !== null ? Math.max(1, simTime - slot.entryTime) : 0;
    const ratePerHour = slot.vehicleType === 'TRUCK' ? 40 : slot.vehicleType === 'BIKE' ? 10 : 20;
    const feeAccrued = isOccupied ? Math.max(ratePerHour, Math.ceil(duration / 10) * ratePerHour) : 0;

    const sectorName =
      slot.id < 16
        ? 'Sector A (Cars 0-15)'
        : slot.id < 26
        ? 'Sector B (Bikes 16-25)'
        : 'Sector C (Trucks 26-31)';

    // Synthesize a deterministic pseudo-hex RFID tag from slot id & vehicle id
    const rfidHex = slot.vehicleId
      ? `0x${Array.from(slot.vehicleId)
          .map((c) => c.charCodeAt(0).toString(16))
          .join('')
          .slice(0, 8)
          .toUpperCase()}`
      : `0x7E${slot.id.toString(16).padStart(2, '0').toUpperCase()}A4F1`;

    return (
      <Card className="bg-muted/30 border-cyan-900/50 shadow-inner">
        <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between border-b border-border/40">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-cyan-300">
            <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Bay #{slot.id} RFID & Sensor HUD</span>
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              'text-[9px] font-mono py-0',
              isOccupied
                ? 'border-red-500 text-red-400 bg-red-950/40'
                : isMaintenance
                ? 'border-orange-500 text-orange-400 bg-orange-950/40'
                : 'border-emerald-500 text-emerald-400 bg-emerald-950/40'
            )}
          >
            {slot.status}
          </Badge>
        </CardHeader>

        <CardContent className="p-2 pt-1.5 space-y-1.5 text-[9.5px] font-mono">
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex justify-between">
              <span className="text-slate-500">Sector</span>
              <span className="text-slate-200 font-bold truncate">{sectorName}</span>
            </div>
            <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex justify-between">
              <span className="text-slate-500">GPIO</span>
              <span className="text-emerald-400 font-bold">P1.{16 + (slot.id % 8)} [OK]</span>
            </div>
          </div>

          {isOccupied ? (
            <div className="bg-slate-950/90 border border-cyan-800/60 rounded p-1.5 space-y-0.5 text-[9px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="text-cyan-300 font-bold">{slot.vehicleId} [{slot.vehicleType}]</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">RFID UID:</span>
                <span className="text-amber-300">{rfidHex}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Parked:</span>
                <span className="text-slate-300">T:{slot.entryTime}s ({duration}s active) · <strong className="text-emerald-400">${feeAccrued}.00</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded p-1.5 text-slate-400 text-center text-[9px]">
              Bay #{slot.id} Vacant · Ready for Inbound
            </div>
          )}

          {/* Quick Bay Actions */}
          <div className="flex gap-1.5 pt-0.5">
            {isOccupied && onExitSlot && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onExitSlot(slot.id)}
                className="flex-1 h-5 text-[9px] bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-2.5 w-2.5 mr-1" />
                Dispatch Exit #{slot.id}
              </Button>
            )}
            {onToggleMaintenance && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleMaintenance(slot.id)}
                className="flex-1 h-5 text-[9px]"
              >
                <Wrench className="h-2.5 w-2.5 mr-1 text-orange-400" />
                {isMaintenance ? 'Restore' : 'Service'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default state: LPC1768 Cortex-M3 Hardware Diagnostics
  return (
    <Card className="bg-muted/30 border-border">
      <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-200">
          <Cpu className="h-3.5 w-3.5 text-sky-400" />
          <span>LPC1768 Hardware Diagnostics</span>
        </CardTitle>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.2 rounded">
          100 MHz
        </span>
      </CardHeader>

      <CardContent className="p-2 pt-0 space-y-1 text-[9.5px] font-mono">
        <div className="grid grid-cols-2 gap-1 text-slate-300">
          <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-500">Core</span>
            <span className="text-sky-300 font-bold">100 MHz (PLL0)</span>
          </div>
          <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-500">SysTick</span>
            <span className="text-emerald-400 font-bold">T:{simTime}s (10ms)</span>
          </div>
          <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-500">Gate A</span>
            <span className="text-cyan-400 font-bold">P2.0 · 50Hz</span>
          </div>
          <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-500">Gate B</span>
            <span className="text-purple-400 font-bold">P2.1 · 50Hz</span>
          </div>
          <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-500">Optical IR</span>
            <span className="text-emerald-400 font-bold">P0.4 / P2.0</span>
          </div>
          <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-500">UART0</span>
            <span className="text-yellow-400 font-bold">115200 8-N-1</span>
          </div>
        </div>

        <div className="text-[8.5px] text-slate-500 flex items-center justify-between pt-0.5 border-t border-slate-800/60">
          <span>Click any parking slot to inspect bay</span>
          <span className="text-cyan-400 font-bold">32 NODES</span>
        </div>
      </CardContent>
    </Card>
  );
}

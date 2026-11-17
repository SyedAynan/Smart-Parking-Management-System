'use client';

import React from 'react';
import { ParkingSlot, SlotStatus, VehicleType } from '@/lib/parking-system';
import { cn } from '@/lib/utils';
import { Car, Bike, Truck, Wrench, Clock, DollarSign, LogOut } from 'lucide-react';
import { VehicleVisual } from '@/components/vehicle-visuals';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ParkingSlotGridProps {
  slots: ParkingSlot[];
  onSlotClick?: (slotId: number) => void;
  highlightedSlot?: number | null;
}

function getSlotColor(status: SlotStatus): string {
  switch (status) {
    case 'OCCUPIED':
      return 'bg-red-500/80 border-red-400 text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]';
    case 'RESERVED':
      return 'bg-yellow-500/80 border-yellow-400 text-slate-950 shadow-[0_0_8px_rgba(234,179,8,0.3)]';
    case 'MAINTENANCE':
      return 'bg-orange-500/80 border-orange-400 text-white';
    default:
      return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30';
  }
}

function getVehicleIcon(vehicleType: VehicleType | null) {
  if (!vehicleType) return null;
  return <VehicleVisual type={vehicleType} className="h-3.5 w-6 my-0.5" isAnimated={false} />;
}

export function ParkingSlotGrid({ slots, onSlotClick, highlightedSlot }: ParkingSlotGridProps) {
  const carSlots = slots.slice(0, 16);
  const bikeSlots = slots.slice(16, 26);
  const truckSlots = slots.slice(26, 32);

  const activeSlot = highlightedSlot !== null && highlightedSlot !== undefined ? slots[highlightedSlot] : null;

  return (
    <div className="space-y-2.5">
      {/* Cars Section */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Car className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold text-slate-200">CARS (0-15) · $20/hr</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            {carSlots.filter((s) => s.status === 'OCCUPIED').length} / 16 Occupied
          </span>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {carSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSlotClick?.(slot.id)}
              className={cn(
                'aspect-square rounded-md border text-[10px] font-mono flex flex-col items-center justify-center transition-all duration-150 relative group',
                getSlotColor(slot.status),
                highlightedSlot === slot.id && 'ring-2 ring-cyan-400 scale-105 shadow-lg'
              )}
              title={`Slot #${slot.id}: ${slot.status}${slot.vehicleId ? ` (${slot.vehicleId})` : ''} - Click to ${slot.status === 'OCCUPIED' ? 'Exit' : 'Toggle Maintenance'}`}
            >
              <span className="text-[9px] font-bold opacity-80">#{slot.id}</span>
              {slot.status === 'MAINTENANCE' ? (
                <Wrench className="h-2.5 w-2.5 text-orange-200" />
              ) : (
                getVehicleIcon(slot.vehicleType)
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bikes Section */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Bike className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-200">BIKES (16-25) · $10/hr</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            {bikeSlots.filter((s) => s.status === 'OCCUPIED').length} / 10 Occupied
          </span>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {bikeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSlotClick?.(slot.id)}
              className={cn(
                'aspect-square rounded-md border text-[10px] font-mono flex flex-col items-center justify-center transition-all duration-150 relative group',
                getSlotColor(slot.status),
                highlightedSlot === slot.id && 'ring-2 ring-emerald-400 scale-105 shadow-lg'
              )}
              title={`Slot #${slot.id}: ${slot.status}${slot.vehicleId ? ` (${slot.vehicleId})` : ''}`}
            >
              <span className="text-[9px] font-bold opacity-80">#{slot.id}</span>
              {slot.status === 'MAINTENANCE' ? (
                <Wrench className="h-2.5 w-2.5 text-orange-200" />
              ) : (
                getVehicleIcon(slot.vehicleType)
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trucks Section */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-200">TRUCKS (26-31) · $40/hr</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            {truckSlots.filter((s) => s.status === 'OCCUPIED').length} / 6 Occupied
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {truckSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSlotClick?.(slot.id)}
              className={cn(
                'aspect-square rounded-md border text-[10px] font-mono flex flex-col items-center justify-center transition-all duration-150 relative group',
                getSlotColor(slot.status),
                highlightedSlot === slot.id && 'ring-2 ring-amber-400 scale-105 shadow-lg'
              )}
              title={`Slot #${slot.id}: ${slot.status}${slot.vehicleId ? ` (${slot.vehicleId})` : ''}`}
            >
              <span className="text-[9px] font-bold opacity-80">#{slot.id}</span>
              {slot.status === 'MAINTENANCE' ? (
                <Wrench className="h-2.5 w-2.5 text-orange-200" />
              ) : (
                getVehicleIcon(slot.vehicleType)
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Slot Detailed HUD Strip */}
      {activeSlot && (
        <div className="bg-slate-900/90 border border-border/80 rounded-lg p-2 flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5">
            <div className={cn('px-2 py-0.5 rounded font-mono font-bold text-xs', getSlotColor(activeSlot.status))}>
              Slot #{activeSlot.id}
            </div>
            <div>
              <div className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px]">
                <span>Status: {activeSlot.status}</span>
                {activeSlot.vehicleType && <Badge variant="outline" className="text-[9px] py-0">{activeSlot.vehicleType}</Badge>}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2 mt-0.5">
                {activeSlot.vehicleId && <span>ID: <strong className="text-cyan-300">{activeSlot.vehicleId}</strong></span>}
                {activeSlot.entryTime !== null && <span>T_IN: {activeSlot.entryTime}s</span>}
              </div>
            </div>
          </div>

          <div>
            {activeSlot.status === 'OCCUPIED' ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onSlotClick?.(activeSlot.id)}
                className="h-6 text-[10px] px-2 flex items-center gap-1 bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-3 w-3" />
                <span>Dispatch Exit</span>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSlotClick?.(activeSlot.id)}
                className="h-6 text-[10px] px-2 flex items-center gap-1"
              >
                <Wrench className="h-3 w-3 text-orange-400" />
                <span>{activeSlot.status === 'MAINTENANCE' ? 'Restore Slot' : 'Set Maintenance'}</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-border/60 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded bg-emerald-500/20 border border-emerald-500/50" />
          <span>Empty (Click to Service)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded bg-red-500/80 border border-red-400" />
          <span>Occupied (Click to Exit)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded bg-orange-500/80 border border-orange-400" />
          <span>Maintenance</span>
        </div>
      </div>
    </div>
  );
}

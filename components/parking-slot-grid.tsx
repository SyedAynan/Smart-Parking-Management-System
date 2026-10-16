'use client';

import { ParkingSlot, SlotStatus } from '@/lib/parking-system';
import { cn } from '@/lib/utils';
import { Car, Bike, Truck, Wrench } from 'lucide-react';

interface ParkingSlotGridProps {
  slots: ParkingSlot[];
  onSlotClick?: (slotId: number) => void;
  highlightedSlot?: number | null;
}

function getSlotColor(status: SlotStatus): string {
  switch (status) {
    case 'OCCUPIED':
      return 'bg-red-500/80 border-red-400';
    case 'RESERVED':
      return 'bg-yellow-500/80 border-yellow-400';
    case 'MAINTENANCE':
      return 'bg-orange-500/80 border-orange-400';
    default:
      return 'bg-emerald-500/30 border-emerald-500/50';
  }
}

function getVehicleIcon(vehicleType: string | null) {
  switch (vehicleType) {
    case 'CAR':
      return <Car className="h-3 w-3" />;
    case 'BIKE':
      return <Bike className="h-3 w-3" />;
    case 'TRUCK':
      return <Truck className="h-3 w-3" />;
    default:
      return null;
  }
}

export function ParkingSlotGrid({ slots, onSlotClick, highlightedSlot }: ParkingSlotGridProps) {
  const carSlots = slots.slice(0, 16);
  const bikeSlots = slots.slice(16, 26);
  const truckSlots = slots.slice(26, 32);

  return (
    <div className="space-y-4">
      {/* Cars Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Car className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-medium text-muted-foreground">CARS (0-15)</span>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {carSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSlotClick?.(slot.id)}
              className={cn(
                'aspect-square rounded border text-[10px] font-mono flex flex-col items-center justify-center transition-all hover:scale-105',
                getSlotColor(slot.status),
                highlightedSlot === slot.id && 'ring-2 ring-white'
              )}
            >
              <span>{slot.id}</span>
              {slot.status === 'MAINTENANCE' ? (
                <Wrench className="h-2.5 w-2.5" />
              ) : (
                getVehicleIcon(slot.vehicleType)
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bikes Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Bike className="h-4 w-4 text-green-400" />
          <span className="text-xs font-medium text-muted-foreground">BIKES (16-25)</span>
        </div>
        <div className="grid grid-cols-10 gap-1">
          {bikeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSlotClick?.(slot.id)}
              className={cn(
                'aspect-square rounded border text-[10px] font-mono flex flex-col items-center justify-center transition-all hover:scale-105',
                getSlotColor(slot.status),
                highlightedSlot === slot.id && 'ring-2 ring-white'
              )}
            >
              <span>{slot.id}</span>
              {slot.status === 'MAINTENANCE' ? (
                <Wrench className="h-2.5 w-2.5" />
              ) : (
                getVehicleIcon(slot.vehicleType)
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trucks Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Truck className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-medium text-muted-foreground">TRUCKS (26-31)</span>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {truckSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSlotClick?.(slot.id)}
              className={cn(
                'aspect-square rounded border text-[10px] font-mono flex flex-col items-center justify-center transition-all hover:scale-105',
                getSlotColor(slot.status),
                highlightedSlot === slot.id && 'ring-2 ring-white'
              )}
            >
              <span>{slot.id}</span>
              {slot.status === 'MAINTENANCE' ? (
                <Wrench className="h-2.5 w-2.5" />
              ) : (
                getVehicleIcon(slot.vehicleType)
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
          <span className="text-xs text-muted-foreground">Empty</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-red-500/80 border border-red-400" />
          <span className="text-xs text-muted-foreground">Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-yellow-500/80 border border-yellow-400" />
          <span className="text-xs text-muted-foreground">Reserved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-orange-500/80 border border-orange-400" />
          <span className="text-xs text-muted-foreground">Maintenance</span>
        </div>
      </div>
    </div>
  );
}

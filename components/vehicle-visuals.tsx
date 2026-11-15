'use client';

import React from 'react';
import { VehicleType } from '@/lib/parking-system';
import { cn } from '@/lib/utils';

interface VehicleVisualProps {
  type: VehicleType;
  className?: string;
  isAnimated?: boolean;
}

export function VehicleVisual({ type, className, isAnimated = false }: VehicleVisualProps) {
  switch (type) {
    case 'CAR':
      return <CarIcon className={className} isAnimated={isAnimated} />;
    case 'BIKE':
      return <BikeIcon className={className} isAnimated={isAnimated} />;
    case 'TRUCK':
      return <TruckIcon className={className} isAnimated={isAnimated} />;
    default:
      return null;
  }
}

export function CarIcon({ className, isAnimated = false }: { className?: string; isAnimated?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block transition-transform', isAnimated && 'animate-pulse', className)}
    >
      {/* Car Body */}
      <path
        d="M6 16L9 11C10 9 13 8 16 8H28C31 8 34 10 36 12L41 15C43 16 44 18 44 20V21H4V18C4 17 5 16 6 16Z"
        fill="#38BDF8"
      />
      {/* Roof & Windows */}
      <path
        d="M14 9.5L16 12H24V9.5H16C15 9.5 14.5 9.5 14 9.5Z"
        fill="#0284C7"
      />
      <path
        d="M26 9.5V12H32.5L30.5 9.5H26Z"
        fill="#0284C7"
      />
      {/* Headlights */}
      <circle cx="42" cy="18" r="1.5" fill="#FEF08A" />
      <circle cx="5" cy="18" r="1.5" fill="#EF4444" />
      {/* Front & Rear Wheels */}
      <circle cx="12" cy="21" r="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
      <circle cx="12" cy="21" r="1" fill="#94A3B8" />
      <circle cx="34" cy="21" r="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
      <circle cx="34" cy="21" r="1" fill="#94A3B8" />
    </svg>
  );
}

export function BikeIcon({ className, isAnimated = false }: { className?: string; isAnimated?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block transition-transform', isAnimated && 'animate-bounce', className)}
    >
      {/* Bike Frame & Fairing */}
      <path
        d="M14 18L19 12H27L22 18H14Z"
        fill="#10B981"
      />
      <path
        d="M23 10L27 6H31L29 11H23Z"
        fill="#059669"
      />
      {/* Rider Handlebars & Windshield */}
      <path d="M28 5L33 5" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 6L32 10" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
      {/* Exhaust */}
      <path d="M12 17L18 19" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Headlight */}
      <circle cx="33" cy="9" r="1.5" fill="#FEF08A" />
      {/* Front & Rear Wheels (Sport Spokes) */}
      <circle cx="10" cy="17" r="4.5" fill="#0F172A" stroke="#34D399" strokeWidth="1.5" />
      <circle cx="10" cy="17" r="1.5" fill="#94A3B8" />
      <circle cx="35" cy="17" r="4.5" fill="#0F172A" stroke="#34D399" strokeWidth="1.5" />
      <circle cx="35" cy="17" r="1.5" fill="#94A3B8" />
    </svg>
  );
}

export function TruckIcon({ className, isAnimated = false }: { className?: string; isAnimated?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block transition-transform', isAnimated && 'animate-pulse', className)}
    >
      {/* Trailer Container */}
      <rect x="3" y="5" width="24" height="13" rx="1.5" fill="#F59E0B" />
      <line x1="7" y1="5" x2="7" y2="18" stroke="#D97706" strokeWidth="0.8" />
      <line x1="15" y1="5" x2="15" y2="18" stroke="#D97706" strokeWidth="0.8" />
      <line x1="23" y1="5" x2="23" y2="18" stroke="#D97706" strokeWidth="0.8" />
      {/* Cab Body */}
      <path
        d="M27 10H37C38.5 10 40 11.5 41 13.5L44 17.5V20H27V10Z"
        fill="#FBBF24"
      />
      {/* Cab Windshield */}
      <path
        d="M34 11.5H38.5L41.5 16H34V11.5Z"
        fill="#0284C7"
      />
      {/* Headlight & Taillight */}
      <circle cx="43" cy="18" r="1.5" fill="#FEF08A" />
      <circle cx="3.5" cy="16" r="1.5" fill="#EF4444" />
      {/* Triple Heavy Duty Wheels */}
      <circle cx="8" cy="20" r="2.5" fill="#1E293B" stroke="#64748B" strokeWidth="1.2" />
      <circle cx="16" cy="20" r="2.5" fill="#1E293B" stroke="#64748B" strokeWidth="1.2" />
      <circle cx="36" cy="20" r="2.5" fill="#1E293B" stroke="#64748B" strokeWidth="1.2" />
    </svg>
  );
}

export function MicrochipBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block', className)}
    >
      {/* Silicon Chip Base */}
      <rect x="6" y="6" width="20" height="20" rx="3" fill="#090D16" stroke="#06B6D4" strokeWidth="1.5" />
      {/* Center Core Matrix */}
      <rect x="10" y="10" width="12" height="12" rx="1.5" fill="#082F49" stroke="#22D3EE" strokeWidth="1" />
      <circle cx="16" cy="16" r="2.5" fill="#06B6D4" className="animate-pulse" />
      {/* Gold/Cyan Pins */}
      <line x1="10" y1="2" x2="10" y2="6" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="22" y1="2" x2="22" y2="6" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="10" y1="26" x2="10" y2="30" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="16" y1="26" x2="16" y2="30" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="22" y1="26" x2="22" y2="30" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="2" y1="10" x2="6" y2="10" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="2" y1="16" x2="6" y2="16" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="2" y1="22" x2="6" y2="22" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="26" y1="10" x2="30" y2="10" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="26" y1="16" x2="30" y2="16" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="26" y1="22" x2="30" y2="22" stroke="#38BDF8" strokeWidth="1.2" />
    </svg>
  );
}

'use client';

import React from 'react';
import { VehicleType } from '@/lib/parking-system';
import { cn } from '@/lib/utils';

interface VehicleVisualProps {
  type: VehicleType;
  className?: string;
  isAnimated?: boolean;
  color?: string;
}

export function VehicleVisual({ type, className, isAnimated = false, color }: VehicleVisualProps) {
  switch (type) {
    case 'CAR':
      return <CarIcon className={className} isAnimated={isAnimated} color={color} />;
    case 'BIKE':
      return <BikeIcon className={className} isAnimated={isAnimated} color={color} />;
    case 'TRUCK':
      return <TruckIcon className={className} isAnimated={isAnimated} color={color} />;
    default:
      return null;
  }
}

export function CarIcon({ className, isAnimated = false, color = '#38BDF8' }: { className?: string; isAnimated?: boolean; color?: string }) {
  return (
    <svg
      viewBox="0 0 64 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block overflow-visible', className)}
    >
      <defs>
        <linearGradient id="carBodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <filter id="headlightGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Headlight beam on road */}
      {isAnimated && (
        <polygon
          points="56,18 78,14 78,26 56,22"
          fill="url(#headlightCone)"
          opacity="0.35"
        />
      )}

      {/* Car Body Shell */}
      <path
        d="M8 20L12 13C13.5 10.5 17 9.5 21 9.5H38C42 9.5 45.5 11.5 48 14L55 18C57.5 19.5 58 21.5 58 23V24H6V22C6 21 7 20 8 20Z"
        fill="url(#carBodyGrad)"
        stroke="#0369A1"
        strokeWidth="0.8"
      />

      {/* Cabin Roof & Windows */}
      <path
        d="M19 11.5L22 14.5H33V11.5H21C20 11.5 19.5 11.5 19 11.5Z"
        fill="#0C4A6E"
        stroke="#38BDF8"
        strokeWidth="0.5"
      />
      <path
        d="M35 11.5V14.5H44L41.5 11.5H35Z"
        fill="#0C4A6E"
        stroke="#38BDF8"
        strokeWidth="0.5"
      />

      {/* Headlight & Taillight */}
      <circle cx="56" cy="20" r="2" fill="#FEF08A" filter="url(#headlightGlow)" />
      <circle cx="7" cy="20" r="1.8" fill="#EF4444" />

      {/* Front & Rear Wheels with rotating hubs */}
      <g className={cn(isAnimated && 'origin-[16px_24px] animate-spin')} style={{ animationDuration: '0.6s' }}>
        <circle cx="16" cy="24" r="4" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
        <circle cx="16" cy="24" r="2" fill="#94A3B8" />
        <line x1="16" y1="21" x2="16" y2="27" stroke="#334155" strokeWidth="0.8" />
        <line x1="13" y1="24" x2="19" y2="24" stroke="#334155" strokeWidth="0.8" />
      </g>
      <g className={cn(isAnimated && 'origin-[46px_24px] animate-spin')} style={{ animationDuration: '0.6s' }}>
        <circle cx="46" cy="24" r="4" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
        <circle cx="46" cy="24" r="2" fill="#94A3B8" />
        <line x1="46" y1="21" x2="46" y2="27" stroke="#334155" strokeWidth="0.8" />
        <line x1="43" y1="24" x2="49" y2="24" stroke="#334155" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

export function BikeIcon({ className, isAnimated = false, color = '#10B981' }: { className?: string; isAnimated?: boolean; color?: string }) {
  return (
    <svg
      viewBox="0 0 54 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block overflow-visible', className)}
    >
      {/* Bike Frame & Tank */}
      <path
        d="M16 20L22 13H31L26 20H16Z"
        fill={color}
        stroke="#047857"
        strokeWidth="0.8"
      />
      <path
        d="M27 11L32 6H37L34 12H27Z"
        fill="#059669"
      />
      {/* Handlebars */}
      <path d="M33 5L39 5" stroke="#F1F5F9" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M35 6L37 11" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" />

      {/* Headlight */}
      <circle cx="39" cy="10" r="2" fill="#FEF08A" />

      {/* Sports Wheels */}
      <g className={cn(isAnimated && 'origin-[13px_20px] animate-spin')} style={{ animationDuration: '0.5s' }}>
        <circle cx="13" cy="20" r="5.5" fill="#020617" stroke="#10B981" strokeWidth="1.8" />
        <circle cx="13" cy="20" r="2" fill="#94A3B8" />
        <line x1="13" y1="16" x2="13" y2="24" stroke="#34D399" strokeWidth="0.8" />
        <line x1="9" y1="20" x2="17" y2="20" stroke="#34D399" strokeWidth="0.8" />
      </g>
      <g className={cn(isAnimated && 'origin-[41px_20px] animate-spin')} style={{ animationDuration: '0.5s' }}>
        <circle cx="41" cy="20" r="5.5" fill="#020617" stroke="#10B981" strokeWidth="1.8" />
        <circle cx="41" cy="20" r="2" fill="#94A3B8" />
        <line x1="41" y1="16" x2="41" y2="24" stroke="#34D399" strokeWidth="0.8" />
        <line x1="37" y1="20" x2="45" y2="20" stroke="#34D399" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

export function TruckIcon({ className, isAnimated = false, color = '#F59E0B' }: { className?: string; isAnimated?: boolean; color?: string }) {
  return (
    <svg
      viewBox="0 0 72 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block overflow-visible', className)}
    >
      {/* Trailer Container */}
      <rect x="4" y="6" width="34" height="18" rx="2" fill={color} stroke="#B45309" strokeWidth="1" />
      <line x1="10" y1="6" x2="10" y2="24" stroke="#B45309" strokeWidth="1" />
      <line x1="21" y1="6" x2="21" y2="24" stroke="#B45309" strokeWidth="1" />
      <line x1="32" y1="6" x2="32" y2="24" stroke="#B45309" strokeWidth="1" />

      {/* Cab Body */}
      <path
        d="M38 12H52C54 12 56 14 57.5 16.5L62 21.5V26H38V12Z"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1"
      />
      {/* Windshield */}
      <path
        d="M48 14H54L58.5 20H48V14Z"
        fill="#0284C7"
      />
      {/* Headlight & Taillight */}
      <circle cx="61" cy="23" r="2" fill="#FEF08A" />
      <circle cx="5" cy="21" r="1.8" fill="#EF4444" />

      {/* Heavy Duty Wheels */}
      <circle cx="11" cy="26" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
      <circle cx="21" cy="26" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
      <circle cx="51" cy="26" r="3.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
    </svg>
  );
}

export function MicrochipBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block overflow-visible drop-shadow-[0_4px_12px_rgba(6,182,212,0.4)]', className)}
    >
      <defs>
        <radialGradient id="chipBadgeShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="badgeSubstrateTop" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="badgeGoldLead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="badgeGoldLeadSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="badgeHeatSpreader" x1="34" y1="34" x2="86" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="40%" stopColor="#155E75" />
          <stop offset="100%" stopColor="#082F49" />
        </linearGradient>
        <filter id="badgeNeonPulse" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="60" cy="100" rx="46" ry="14" fill="url(#chipBadgeShadow)" />

      {/* Golden Metallic Leads */}
      {[34, 46, 58, 70, 82].map((x, i) => (
        <rect key={`tb-${i}`} x={x - 2.5} y="10" width="5" height="12" rx="1" fill="url(#badgeGoldLead)" />
      ))}
      {[34, 46, 58, 70, 82].map((x, i) => (
        <rect key={`bb-${i}`} x={x - 2.5} y="86" width="5" height="14" rx="1" fill="url(#badgeGoldLead)" />
      ))}
      {[34, 46, 58, 70, 82].map((y, i) => (
        <rect key={`lb-${i}`} x="10" y={y - 2.5} width="12" height="5" rx="1" fill="url(#badgeGoldLeadSide)" />
      ))}
      {[34, 46, 58, 70, 82].map((y, i) => (
        <rect key={`rb-${i}`} x="86" y={y - 2.5} width="14" height="5" rx="1" fill="url(#badgeGoldLeadSide)" />
      ))}

      {/* 3D Ceramic Body */}
      <rect x="19" y="24" width="82" height="72" rx="12" fill="#070D1A" />
      <rect
        x="19"
        y="19"
        width="82"
        height="72"
        rx="10"
        fill="url(#badgeSubstrateTop)"
        stroke="#38BDF8"
        strokeWidth="1.6"
      />

      {/* Orientation Notch */}
      <circle cx="28" cy="28" r="3" fill="#030712" stroke="#1E293B" strokeWidth="1" />
      <circle cx="28" cy="28" r="1.2" fill="#0284C7" />

      {/* Silicon Die */}
      <rect
        x="33"
        y="33"
        width="54"
        height="44"
        rx="6"
        fill="url(#badgeHeatSpreader)"
        stroke="#F59E0B"
        strokeWidth="1.2"
      />
      <text
        x="60"
        y="48"
        textAnchor="middle"
        fill="#38BDF8"
        fontSize="7"
        fontWeight="bold"
        fontFamily="monospace"
        letterSpacing="0.8"
      >
        LPC1768
      </text>
      <text
        x="60"
        y="56"
        textAnchor="middle"
        fill="#94A3B8"
        fontSize="5"
        fontFamily="sans-serif"
      >
        ARM-M3
      </text>
      <circle cx="60" cy="65" r="4" fill="#06B6D4" filter="url(#badgeNeonPulse)" />
      <circle cx="60" cy="65" r="1.8" fill="#FFFFFF" />
    </svg>
  );
}

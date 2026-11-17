'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Microchip3DIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * High-fidelity 3D Isometric Microchip Icon
 * Inspired by IconScout 3D Microchip Icon style (3D ceramic package, golden dual-inline pins,
 * brushed silicon heat spreader, and glowing LPC1768 neon core).
 */
export function Microchip3DIcon({ className, size = 32, glow = true }: Microchip3DIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block overflow-visible drop-shadow-[0_4px_12px_rgba(6,182,212,0.35)]', className)}
    >
      <defs>
        {/* Ambient Ground Shadow */}
        <radialGradient id="chip3DShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* 3D Ceramic Substrate Gradients */}
        <linearGradient id="substrateTop" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="substrateBevel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#0284C7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="substrateBottomEdge" x1="60" y1="85" x2="60" y2="98" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>

        {/* Golden Metallic Leads / Pins */}
        <linearGradient id="goldLead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="80%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="goldLeadSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>

        {/* Central Silicon Die / Heat Spreader */}
        <linearGradient id="heatSpreader" x1="34" y1="34" x2="86" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="35%" stopColor="#155E75" />
          <stop offset="70%" stopColor="#082F49" />
          <stop offset="100%" stopColor="#0c1a2e" />
        </linearGradient>
        <linearGradient id="goldCoreBorder" x1="32" y1="32" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Glow Filter for Core Diode */}
        <filter id="neonPulse" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 3D Cast Shadow */}
      <ellipse cx="60" cy="100" rx="46" ry="14" fill="url(#chip3DShadow)" />

      {/* ========================================================================= */}
      {/* 3D METALLIC PINS (Leads protruding from all 4 sides)                      */}
      {/* ========================================================================= */}
      {/* Top Pins (projecting up) */}
      <g>
        {[34, 46, 58, 70, 82].map((x, i) => (
          <g key={`top-pin-${i}`}>
            <rect x={x - 3} y="10" width="6" height="12" rx="1.5" fill="url(#goldLead)" />
            <rect x={x - 3} y="10" width="2" height="12" fill="#FEF08A" opacity="0.6" />
            <path d={`M${x - 3} 10 L${x + 3} 10 L${x + 2} 12 L${x - 2} 12 Z`} fill="#FFFFFF" opacity="0.8" />
          </g>
        ))}
      </g>

      {/* Bottom Pins (projecting down with 3D drop perspective) */}
      <g>
        {[34, 46, 58, 70, 82].map((x, i) => (
          <g key={`bot-pin-${i}`}>
            <rect x={x - 3} y="86" width="6" height="14" rx="1.5" fill="url(#goldLead)" />
            <rect x={x - 3} y="86" width="2" height="14" fill="#FEF08A" opacity="0.6" />
            <rect x={x + 1} y="86" width="2" height="14" fill="#78350F" opacity="0.5" />
          </g>
        ))}
      </g>

      {/* Left Pins (projecting left) */}
      <g>
        {[34, 46, 58, 70, 82].map((y, i) => (
          <g key={`left-pin-${i}`}>
            <rect x="10" y={y - 3} width="12" height="6" rx="1.5" fill="url(#goldLeadSide)" />
            <rect x="10" y={y - 3} width="12" height="2" fill="#FEF08A" opacity="0.6" />
          </g>
        ))}
      </g>

      {/* Right Pins (projecting right) */}
      <g>
        {[34, 46, 58, 70, 82].map((y, i) => (
          <g key={`right-pin-${i}`}>
            <rect x="86" y={y - 3} width="14" height="6" rx="1.5" fill="url(#goldLeadSide)" />
            <rect x="86" y={y - 3} width="14" height="2" fill="#FEF08A" opacity="0.6" />
          </g>
        ))}
      </g>

      {/* ========================================================================= */}
      {/* 3D CERAMIC WAFER BODY (Extruded Isometric Look)                          */}
      {/* ========================================================================= */}
      {/* 3D Lower Extrusion / Thickness Base */}
      <rect x="19" y="24" width="82" height="72" rx="12" fill="url(#substrateBottomEdge)" />

      {/* 3D Main Ceramic Top Plate */}
      <rect
        x="19"
        y="19"
        width="82"
        height="72"
        rx="10"
        fill="url(#substrateTop)"
        stroke="url(#substrateBevel)"
        strokeWidth="1.8"
      />

      {/* Specular Highlight along Top-Left Edge */}
      <path
        d="M29 20 H91 C96 20 100 24 100 29"
        stroke="#38BDF8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Pin 1 Orientation Indent / Notch (Classic IC package marker) */}
      <circle cx="28" cy="28" r="3.5" fill="#030712" stroke="#1E293B" strokeWidth="1" />
      <circle cx="28" cy="28" r="1.5" fill="#0284C7" opacity="0.7" />

      {/* ========================================================================= */}
      {/* PRINTED CIRCUIT TRACES ON CERAMIC SURFACE                                */}
      {/* ========================================================================= */}
      <g stroke="#0284C7" strokeWidth="1" strokeLinecap="round" opacity="0.45">
        <path d="M34 22 V32" />
        <path d="M46 22 V32" />
        <path d="M58 22 V32" />
        <path d="M70 22 V32" />
        <path d="M82 22 V32" />

        <path d="M22 34 H32" />
        <path d="M22 46 H32" />
        <path d="M22 58 H32" />
        <path d="M22 70 H32" />
        <path d="M22 82 H32" />

        <path d="M88 34 H98" />
        <path d="M88 46 H98" />
        <path d="M88 58 H98" />
        <path d="M88 70 H98" />
        <path d="M88 82 H98" />

        <path d="M34 78 V88" />
        <path d="M46 78 V88" />
        <path d="M58 78 V88" />
        <path d="M70 78 V88" />
        <path d="M82 78 V88" />
      </g>

      {/* ========================================================================= */}
      {/* CENTRAL SILICON DIE / HEAT SPREADER (LPC1768 Cortex-M3 Core)              */}
      {/* ========================================================================= */}
      <rect
        x="33"
        y="33"
        width="54"
        height="44"
        rx="6"
        fill="url(#heatSpreader)"
        stroke="url(#goldCoreBorder)"
        strokeWidth="1.5"
      />

      {/* Inner Metallic Bevel */}
      <rect x="36" y="36" width="48" height="38" rx="4" fill="#031525" opacity="0.7" />

      {/* Laser-Etched Text: ARM Cortex-M3 / ParkCore */}
      <text
        x="60"
        y="47"
        textAnchor="middle"
        fill="#38BDF8"
        fontSize="6.5"
        fontWeight="bold"
        fontFamily="monospace"
        letterSpacing="0.8"
      >
        LPC1768
      </text>
      <text
        x="60"
        y="55"
        textAnchor="middle"
        fill="#94A3B8"
        fontSize="5"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        ARM Cortex-M3
      </text>

      {/* Central Pulsing Diode / Micro-Core Status Light */}
      <circle
        cx="60"
        cy="64"
        r="4.5"
        fill="#06B6D4"
        filter={glow ? 'url(#neonPulse)' : undefined}
      />
      <circle cx="60" cy="64" r="2.2" fill="#E0F2FE" />

      {/* Corner Registration Markings */}
      <path d="M38 40 H41 V43" stroke="#FDE047" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M82 40 H79 V43" stroke="#FDE047" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M38 70 H41 V67" stroke="#FDE047" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M82 70 H79 V67" stroke="#FDE047" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  );
}

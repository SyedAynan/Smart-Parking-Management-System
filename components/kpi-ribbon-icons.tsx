'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * 1. Occupancy 3D Icon
 * Matches IconScout 3D Occupied Icon (#14068573):
 * 3D hanging sign with tubular magenta frame, white plaque, and extruded 'OCCUPIED' lettering.
 * Features realistic 3D pendulum hanging sway motion.
 */
export function Occupancy3DIcon({ className = 'w-7.5 h-7.5' }: { className?: string }) {
  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0 overflow-visible', className)}>
      <style>{`
        @keyframes occupancyHangingSway {
          0%, 100% {
            transform: perspective(500px) rotateZ(-3.5deg) rotateY(-5deg) translateY(0px) scale(1.15);
          }
          50% {
            transform: perspective(500px) rotateZ(3.5deg) rotateY(5deg) translateY(-2px) scale(1.18);
          }
        }
      `}</style>
      <img
        src="/icons/occupancy-3d.webp"
        alt="Occupancy 3D Icon (IconScout 14068573)"
        style={{ animation: 'occupancyHangingSway 4s ease-in-out infinite' }}
        className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(233,30,99,0.5)] select-none pointer-events-none"
      />
    </div>
  );
}

/**
 * 2. Revenue Lottie Animation Icon
 * Matches IconScout Revenue Animation (#10890838):
 * 2D isometric gold coin stacks with black line-art, top dollar signs ($),
 * dynamic circulating purple transaction arrow, elastic coin stack bounce,
 * hovering incoming revenue coin, and twinkling golden sparkles.
 */
export function RevenueLottieIcon({ className = 'w-7.5 h-7.5' }: { className?: string }) {
  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0 overflow-visible', className)}>
      <style>{`
        /* Elastic Coin Stacking & Accumulation Dynamics */
        @keyframes revenueTallStackBounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          30% { transform: translateY(-3.5px) scale(1.02); }
          50% { transform: translateY(0.5px) scale(0.99); }
          70% { transform: translateY(-1px) scale(1.01); }
        }
        @keyframes revenueShortStackBounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          35% { transform: translateY(-2.5px) scale(1.02); }
          55% { transform: translateY(0.5px) scale(0.99); }
        }
        /* Hovering Incoming Floating Gold Coin */
        @keyframes floatingCoinGleam {
          0%, 100% {
            transform: translateY(0px) rotate(-6deg) scale(0.95);
            filter: drop-shadow(0 2px 4px rgba(245,158,11,0.4));
          }
          50% {
            transform: translateY(-5px) rotate(6deg) scale(1.05);
            filter: drop-shadow(0 4px 8px rgba(245,158,11,0.8));
          }
        }
        /* 360° Continuous Orbiting Transaction Flow */
        @keyframes revenueArrowCirculate {
          0% {
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 3px rgba(168,85,247,0.5));
          }
          50% {
            transform: rotate(180deg) scale(1.08);
            filter: drop-shadow(0 0 7px rgba(192,132,252,0.9));
          }
          100% {
            transform: rotate(360deg) scale(1);
            filter: drop-shadow(0 0 3px rgba(168,85,247,0.5));
          }
        }
        /* Twinkling Golden Star Sparkles */
        @keyframes sparklePop1 {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          40%, 60% { transform: scale(1.2) rotate(45deg); opacity: 1; }
          80% { transform: scale(0) rotate(90deg); opacity: 0; }
        }
        @keyframes sparklePop2 {
          0%, 30% { transform: scale(0) rotate(0deg); opacity: 0; }
          65%, 85% { transform: scale(1.1) rotate(-45deg); opacity: 1; }
          100% { transform: scale(0) rotate(-90deg); opacity: 0; }
        }
      `}</style>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_2px_8px_rgba(245,158,11,0.45)]"
      >
        <defs>
          <linearGradient id="goldCoinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="goldCoinTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id="purpleArrowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D8B4FE" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6B21A8" />
          </linearGradient>
          <linearGradient id="floatCoinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* ========================================================================= */}
        {/* ROTATING 360° PURPLE CIRCULATION ARROW ORBIT (Centered around coins)       */}
        {/* ========================================================================= */}
        <g style={{ transformOrigin: '48px 60px', animation: 'revenueArrowCirculate 5s linear infinite' }}>
          <path
            d="M20 54 C12 62 14 74 24 80 C34 86 52 84 56 78 L52 74 L66 73 L63 60 L59 64 C54 70 38 72 30 67 C23 62 21 54 26 48 Z"
            fill="url(#purpleArrowGrad)"
            stroke="#1E293B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M22 60 C18 68 22 74 28 77" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>

        {/* ========================================================================= */}
        {/* RIGHT TALL COIN STACK (4 Coins) with spring bounce                         */}
        {/* ========================================================================= */}
        <g style={{ transformOrigin: '65px 70px', animation: 'revenueTallStackBounce 2.8s ease-in-out infinite' }}>
          {/* Base Cylinders */}
          <path d="M52 46 C52 41 78 41 78 46 L78 68 C78 73 52 73 52 68 Z" fill="url(#goldCoinGrad)" stroke="#1E293B" strokeWidth="2.5" />
          {/* Intermediate Grooves */}
          <path d="M52 54 C52 59 78 59 78 54" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M52 61 C52 66 78 66 78 61" stroke="#1E293B" strokeWidth="2" fill="none" />
          {/* Top Oval Face */}
          <ellipse cx="65" cy="46" rx="13" ry="6.5" fill="url(#goldCoinTop)" stroke="#1E293B" strokeWidth="2.5" />
          {/* Dollar Sign on Top */}
          <text x="65" y="49" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="900" fontFamily="monospace">
            $
          </text>
        </g>

        {/* ========================================================================= */}
        {/* LEFT LOWER COIN STACK (3 Coins) with offset bounce                         */}
        {/* ========================================================================= */}
        <g style={{ transformOrigin: '35px 75px', animation: 'revenueShortStackBounce 2.8s ease-in-out infinite 0.35s' }}>
          {/* Base Cylinders */}
          <path d="M22 55 C22 50 48 50 48 55 L48 76 C48 81 22 81 22 76 Z" fill="url(#goldCoinGrad)" stroke="#1E293B" strokeWidth="2.5" />
          {/* Intermediate Grooves */}
          <path d="M22 62 C22 67 48 67 48 62" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M22 69 C22 74 48 74 48 69" stroke="#1E293B" strokeWidth="2" fill="none" />
          {/* Top Oval Face */}
          <ellipse cx="35" cy="55" rx="13" ry="6.5" fill="url(#goldCoinTop)" stroke="#1E293B" strokeWidth="2.5" />
          {/* Dollar Sign on Top */}
          <text x="35" y="58" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="900" fontFamily="monospace">
            $
          </text>
        </g>

        {/* ========================================================================= */}
        {/* HOVERING FLOATING GOLD COIN (Incoming revenue flow)                       */}
        {/* ========================================================================= */}
        <g style={{ transformOrigin: '52px 28px', animation: 'floatingCoinGleam 2.2s ease-in-out infinite' }}>
          {/* Floating Coin Rim */}
          <path d="M42 28 C42 24 62 24 62 28 L62 33 C62 37 42 37 42 33 Z" fill="url(#floatCoinGrad)" stroke="#1E293B" strokeWidth="2" />
          {/* Floating Coin Top Oval */}
          <ellipse cx="52" cy="28" rx="10" ry="5" fill="#FEF08A" stroke="#1E293B" strokeWidth="2" />
          <text x="52" y="30.5" textAnchor="middle" fill="#0F172A" fontSize="6.5" fontWeight="900" fontFamily="monospace">
            $
          </text>
        </g>

        {/* ========================================================================= */}
        {/* TWINKLING GOLDEN STAR SPARKLES                                            */}
        {/* ========================================================================= */}
        {/* Sparkle 1 (Top Right) */}
        <path
          d="M80 32 Q 80 27, 85 27 Q 80 27, 80 22 Q 80 27, 75 27 Q 80 27, 80 32 Z"
          fill="#FDE047"
          style={{ transformOrigin: '80px 27px', animation: 'sparklePop1 2.5s ease-in-out infinite' }}
        />
        {/* Sparkle 2 (Top Left) */}
        <path
          d="M18 42 Q 18 38, 22 38 Q 18 38, 18 34 Q 18 38, 14 38 Q 18 38, 18 42 Z"
          fill="#FBBF24"
          style={{ transformOrigin: '18px 38px', animation: 'sparklePop2 2.8s ease-in-out infinite' }}
        />
      </svg>
    </div>
  );
}

/**
 * 3. Utilization Lottie Animation Icon
 * Matches IconScout Filling Circle Loader Animation (#5450153):
 * Circular glass orb enclosing 4 dynamic undulating liquid wave layers
 * (Red base -> Amber -> Emerald Green -> Royal Blue crest) that continuously
 * roll, churn, and oscillate in fluid motion with ambient surface highlights.
 */
export function UtilizationLottieIcon({ className = 'w-7.5 h-7.5' }: { className?: string }) {
  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full', className)}>
      <style>{`
        @keyframes waveSloshFast {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-40px) translateY(-2px); }
          100% { transform: translateX(-80px) translateY(0px); }
        }
        @keyframes waveSloshSlow {
          0% { transform: translateX(-80px) translateY(-1px); }
          50% { transform: translateX(-40px) translateY(1.5px); }
          100% { transform: translateX(0px) translateY(-1px); }
        }
        @keyframes waveSloshMid {
          0% { transform: translateX(0px) translateY(1px); }
          50% { transform: translateX(-50px) translateY(-1.5px); }
          100% { transform: translateX(-100px) translateY(1px); }
        }
        @keyframes bubbleRise {
          0% { transform: translateY(20px) scale(0.6); opacity: 0; }
          40% { opacity: 0.8; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-30px) scale(1.1); opacity: 0; }
        }
      `}</style>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(16,185,129,0.45)]"
      >
        <defs>
          <clipPath id="circleLoaderClip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
          <linearGradient id="blueWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="greenWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="amberWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="redWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>

        <g clipPath="url(#circleLoaderClip)">
          {/* Glass orb reservoir dark background */}
          <circle cx="50" cy="50" r="48" fill="#0A0F1D" stroke="#1E293B" strokeWidth="2.5" />

          {/* Layer 1: Base Deep Red Liquid Layer */}
          <g style={{ animation: 'waveSloshFast 3s linear infinite' }}>
            <path
              d="M-40 68 Q 0 60, 40 68 T 120 68 T 200 68 T 280 68 L 280 120 L -40 120 Z"
              fill="url(#redWaveGrad)"
            />
          </g>

          {/* Layer 2: Amber Yellow Liquid Wave */}
          <g style={{ animation: 'waveSloshSlow 4s linear infinite' }}>
            <path
              d="M-40 52 Q 0 44, 40 52 T 120 52 T 200 52 T 280 52 L 280 72 L -40 72 Z"
              fill="url(#amberWaveGrad)"
              opacity="0.95"
            />
          </g>

          {/* Layer 3: Emerald Green Liquid Wave */}
          <g style={{ animation: 'waveSloshMid 3.2s linear infinite' }}>
            <path
              d="M-40 38 Q 0 28, 40 38 T 120 38 T 200 38 T 280 38 L 280 56 L -40 56 Z"
              fill="url(#greenWaveGrad)"
              opacity="0.95"
            />
          </g>

          {/* Layer 4: Top Royal Blue Fluid Crest */}
          <g style={{ animation: 'waveSloshFast 2.4s linear infinite' }}>
            <path
              d="M-40 24 Q 0 14, 40 24 T 120 24 T 200 24 T 280 24 L 280 42 L -40 42 Z"
              fill="url(#blueWaveGrad)"
              opacity="0.98"
            />
          </g>

          {/* Effervescent Rising Micro Bubbles */}
          <circle cx="35" cy="55" r="2.2" fill="#FFFFFF" style={{ animation: 'bubbleRise 2s ease-in infinite' }} />
          <circle cx="62" cy="65" r="1.8" fill="#FFFFFF" style={{ animation: 'bubbleRise 2.6s ease-in infinite 0.7s' }} />
          <circle cx="48" cy="75" r="1.5" fill="#FFFFFF" style={{ animation: 'bubbleRise 2.3s ease-in infinite 1.2s' }} />

          {/* Specular Curvature Glass Reflection Overlay */}
          <ellipse cx="50" cy="18" rx="28" ry="7" fill="#FFFFFF" opacity="0.25" />
          <path d="M12 40 C14 24, 25 15, 42 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.3" fill="none" />
        </g>

        {/* Outer Circular Chrome Bezel */}
        <circle cx="50" cy="50" r="47.5" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" fill="none" />
      </svg>
    </div>
  );
}

/**
 * 4. Gate Traffic Lottie Animation Icon
 * Matches IconScout Traffic Light Animation (#4841316):
 * Horizontal pill signal enclosure with protective visor hoods.
 * Actively cycles through full traffic states with illuminated neon glow,
 * lens reflection dynamics, and 3D floating perspective.
 */
export function GateTrafficLottieIcon({ className = 'w-10 h-6' }: { className?: string }) {
  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0 overflow-visible', className)}>
      <style>{`
        /* Smooth continuous 3.6s cycle through GREEN -> YELLOW -> RED */
        @keyframes trafficGreenCycle {
          0%, 38% {
            fill: #10B981;
            filter: drop-shadow(0 0 7px #10B981);
            opacity: 1;
          }
          45%, 100% {
            fill: #064E3B;
            filter: none;
            opacity: 0.35;
          }
        }
        @keyframes trafficYellowCycle {
          0%, 36% {
            fill: #78350F;
            filter: none;
            opacity: 0.35;
          }
          40%, 62% {
            fill: #F59E0B;
            filter: drop-shadow(0 0 7px #F59E0B);
            opacity: 1;
          }
          68%, 100% {
            fill: #78350F;
            filter: none;
            opacity: 0.35;
          }
        }
        @keyframes trafficRedCycle {
          0%, 62% {
            fill: #7F1D1D;
            filter: none;
            opacity: 0.35;
          }
          66%, 96% {
            fill: #EF4444;
            filter: drop-shadow(0 0 7px #EF4444);
            opacity: 1;
          }
          100% {
            fill: #7F1D1D;
            filter: none;
            opacity: 0.35;
          }
        }
        @keyframes trafficHousingTilt {
          0%, 100% { transform: perspective(400px) rotateY(-4deg) rotateZ(0deg) translateY(0px); }
          50% { transform: perspective(400px) rotateY(4deg) rotateZ(-1deg) translateY(-1.5px); }
        }
      `}</style>
      <svg
        viewBox="0 0 120 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'trafficHousingTilt 3.6s ease-in-out infinite' }}
        className="w-full h-full overflow-visible drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <linearGradient id="trafficHousingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A3241" />
            <stop offset="50%" stopColor="#181E29" />
            <stop offset="100%" stopColor="#0F131A" />
          </linearGradient>
          <linearGradient id="visorMetalGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* Horizontal Dark Pill Signal Enclosure with Metallic Bevel */}
        <rect x="4" y="6" width="112" height="38" rx="19" fill="url(#trafficHousingGrad)" stroke="#475569" strokeWidth="2.5" />
        <rect x="6" y="8" width="108" height="34" rx="17" fill="none" stroke="#64748B" strokeWidth="0.8" opacity="0.6" />

        {/* Visor 1 (Red - Left) */}
        <path d="M14 11 C14 4 40 4 40 11" stroke="url(#visorMetalGrad)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        {/* Visor 2 (Yellow - Center) */}
        <path d="M47 11 C47 4 73 4 73 11" stroke="url(#visorMetalGrad)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        {/* Visor 3 (Green - Right) */}
        <path d="M80 11 C80 4 106 4 106 11" stroke="url(#visorMetalGrad)" strokeWidth="3.2" fill="none" strokeLinecap="round" />

        {/* Lens 1: RED Signal (Cycles in 3.6s loop) */}
        <circle
          cx="27"
          cy="25"
          r="10.5"
          style={{ animation: 'trafficRedCycle 3.6s infinite' }}
        />
        <circle cx="24.5" cy="21.5" r="2.8" fill="#FFFFFF" opacity="0.75" />

        {/* Lens 2: YELLOW Signal (Cycles in 3.6s loop) */}
        <circle
          cx="60"
          cy="25"
          r="10.5"
          style={{ animation: 'trafficYellowCycle 3.6s infinite' }}
        />
        <circle cx="57.5" cy="21.5" r="2.8" fill="#FFFFFF" opacity="0.75" />

        {/* Lens 3: GREEN Signal (Cycles in 3.6s loop) */}
        <circle
          cx="93"
          cy="25"
          r="10.5"
          style={{ animation: 'trafficGreenCycle 3.6s infinite' }}
        />
        <circle cx="90.5" cy="21.5" r="2.8" fill="#FFFFFF" opacity="0.75" />
      </svg>
    </div>
  );
}

/**
 * 5. LPC1768 Core AI 3D Icon
 * Matches IconScout Core AI 3D Icon (#10646775):
 * Square periwinkle ceramic carrier with silver bevel frame, elevated golden core processor die,
 * and 12 golden bus traces ending in glossy spherical blue terminal nodes.
 * Features realistic 3D gyroscopic hovering/tilting in 3D perspective space,
 * an active rotating 3D holographic quantum energy ring, and a pulsating 100MHz core luminescence.
 */
export function CoreAi3DIcon({ className = 'w-7.5 h-7.5' }: { className?: string }) {
  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0 overflow-visible', className)}>
      <style>{`
        /* 3D Multi-Axis Gyroscopic Floating & Tilting Motion */
        @keyframes lpcCore3dGyroscopic {
          0% {
            transform: perspective(500px) rotateX(12deg) rotateY(-14deg) rotateZ(0deg) translateY(0px) scale(1.15);
          }
          25% {
            transform: perspective(500px) rotateX(4deg) rotateY(12deg) rotateZ(3deg) translateY(-3px) scale(1.2);
          }
          50% {
            transform: perspective(500px) rotateX(-8deg) rotateY(8deg) rotateZ(-2deg) translateY(-1px) scale(1.15);
          }
          75% {
            transform: perspective(500px) rotateX(6deg) rotateY(-12deg) rotateZ(-3deg) translateY(-4px) scale(1.2);
          }
          100% {
            transform: perspective(500px) rotateX(12deg) rotateY(-14deg) rotateZ(0deg) translateY(0px) scale(1.15);
          }
        }

        /* Continuous 3D Holographic Quantum Orbital Energy Ring */
        @keyframes coreHoloOrbital {
          0% {
            transform: perspective(500px) rotateX(68deg) rotateZ(0deg);
          }
          100% {
            transform: perspective(500px) rotateX(68deg) rotateZ(360deg);
          }
        }

        /* 100MHz Core Clock Energy Pulse */
        @keyframes corePulseAura {
          0%, 100% {
            opacity: 0.55;
            transform: scale(0.9);
            filter: drop-shadow(0 0 6px #38BDF8);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.15);
            filter: drop-shadow(0 0 14px #38BDF8);
          }
        }
      `}</style>

      {/* Holographic Quantum Energy Orbital Ring (Rotating in 3D around Chip) */}
      <div
        className="absolute w-10 h-10 rounded-full border border-cyan-400/60 pointer-events-none"
        style={{
          animation: 'coreHoloOrbital 3s linear infinite',
          boxShadow: '0 0 8px rgba(34,211,238,0.5), inset 0 0 6px rgba(34,211,238,0.3)',
        }}
      />

      {/* Pulsing Core Energy Backlight Aura */}
      <div
        className="absolute w-6 h-6 rounded-md bg-cyan-500/30 blur-xs pointer-events-none"
        style={{ animation: 'corePulseAura 1.8s ease-in-out infinite' }}
      />

      {/* IconScout 3D Core AI Processor Chip with Gyroscopic Floating Motion */}
      <img
        src="/icons/core-ai-3d.webp"
        alt="Core AI 3D Icon (IconScout 10646775)"
        style={{ animation: 'lpcCore3dGyroscopic 4.5s ease-in-out infinite' }}
        className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(56,189,248,0.6)] select-none pointer-events-none transition-all duration-300"
      />
    </div>
  );
}

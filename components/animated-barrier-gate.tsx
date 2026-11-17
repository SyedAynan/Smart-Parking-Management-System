'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SystemState, ParkingEvent, VehicleType, ParkingSlot } from '@/lib/parking-system';
import { VehicleVisual } from '@/components/vehicle-visuals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { simulationAudio } from '@/lib/simulation-audio';
import {
  Radio,
  Volume2,
  VolumeX,
  Scan,
  LogIn,
  LogOut,
  Car,
  Bike,
  Truck,
  Receipt,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export type LanePhase =
  | 'STANDBY'
  | 'APPROACHING'
  | 'IR_BLOCKED'
  | 'PROCESSING'
  | 'BARRIER_RAISING'
  | 'PASSING_GATE'
  | 'IR_EXIT_BLOCKED'
  | 'BARRIER_LOWERING'
  | 'DONE';

export interface ActiveVehicle {
  id: string;
  type: VehicleType;
  color: string;
  slotId?: number;
  fee?: number;
  duration?: number;
  progress: number; // 0 to 100%
  phase: LanePhase;
}

interface AnimatedBarrierGateProps {
  currentState: SystemState;
  lastEvent?: ParkingEvent;
  simTime: number;
  slots?: ParkingSlot[];
  onDispatchEntry?: (type: VehicleType) => void;
  onDispatchExit?: (slotId: number) => void;
}

const VEHICLE_COLORS = ['#38BDF8', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#E2E8F0'];

export function AnimatedBarrierGate({
  currentState,
  lastEvent,
  simTime,
  slots = [],
  onDispatchEntry,
  onDispatchExit,
}: AnimatedBarrierGateProps) {
  // Sound toggle
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Manual Overrides
  const [overrideA, setOverrideA] = useState<'AUTO' | 'FORCE_OPEN' | 'FORCE_CLOSED'>('AUTO');
  const [overrideB, setOverrideB] = useState<'AUTO' | 'FORCE_OPEN' | 'FORCE_CLOSED'>('AUTO');

  // Lane 1 (Entry - Inbound: Left -> Right ➔)
  const [entryVehicle, setEntryVehicle] = useState<ActiveVehicle | null>(null);
  const [barrierAngleA, setBarrierAngleA] = useState<number>(0);
  const [irEntryBrokenA, setIrEntryBrokenA] = useState<boolean>(false);
  const [irExitBrokenA, setIrExitBrokenA] = useState<boolean>(false);
  const [entryScanData, setEntryScanData] = useState<{ plate: string; type: string; status: string } | null>(null);

  // Lane 2 (Exit - Outbound: Right -> Left ⬅)
  const [exitVehicle, setExitVehicle] = useState<ActiveVehicle | null>(null);
  const [barrierAngleB, setBarrierAngleB] = useState<number>(0);
  const [irEntryBrokenB, setIrEntryBrokenB] = useState<boolean>(false);
  const [irExitBrokenB, setIrExitBrokenB] = useState<boolean>(false);
  const [exitReceiptData, setExitReceiptData] = useState<{ plate: string; type: string; fee: string; duration: string } | null>(null);

  const entryRef = useRef<ActiveVehicle | null>(null);
  entryRef.current = entryVehicle;

  const exitRef = useRef<ActiveVehicle | null>(null);
  exitRef.current = exitVehicle;

  // Toggle Audio
  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    simulationAudio.enabled = next;
    if (next) simulationAudio.playSensorTrip();
  };

  // Start visual transit animation for an entering vehicle
  const startEntryVisual = useCallback(
    (type: VehicleType, vehicleId?: string) => {
      if (entryRef.current) return; // Lane A busy

      const id = vehicleId || `V-${Math.floor(1000 + Math.random() * 9000)}`;
      const color = VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)];

      const newVehicle: ActiveVehicle = {
        id,
        type,
        color,
        progress: 0,
        phase: 'APPROACHING',
      };

      entryRef.current = newVehicle;
      setEntryVehicle(newVehicle);
      setEntryScanData(null);
    },
    []
  );

  // Start visual transit animation for an exiting vehicle
  const startExitVisual = useCallback(
    (targetSlotId?: number) => {
      if (exitRef.current) return; // Lane B busy

      let slot: ParkingSlot | undefined;
      if (targetSlotId !== undefined) {
        slot = slots.find((s) => s.id === targetSlotId);
      }
      if (!slot) {
        const occupied = slots.filter((s) => s.status === 'OCCUPIED');
        if (occupied.length > 0) {
          slot = occupied[Math.floor(Math.random() * occupied.length)];
        }
      }

      const id = slot?.vehicleId || `V-${Math.floor(1000 + Math.random() * 9000)}`;
      const type = slot?.vehicleType || 'CAR';
      const color = VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)];
      const durationHours = slot?.entryTime !== null && slot?.entryTime !== undefined
        ? Math.max(1, Math.ceil((simTime - slot.entryTime) / 2))
        : 2;
      const rate = type === 'CAR' ? 20 : type === 'BIKE' ? 10 : 40;
      const fee = durationHours * rate;

      const newVehicle: ActiveVehicle = {
        id,
        type,
        color,
        slotId: slot?.id,
        duration: durationHours,
        fee,
        progress: 0,
        phase: 'APPROACHING',
      };

      exitRef.current = newVehicle;
      setExitVehicle(newVehicle);
      setExitReceiptData(null);
    },
    [slots, simTime]
  );

  // User clicked "+ Car / + Bike / + Truck" in the gate plaza
  const handleUserDispatchEntry = useCallback(
    (type: VehicleType) => {
      if (entryRef.current) return; // Lane A busy
      // Trigger simulation state machine ONCE - visualization will sync automatically
      onDispatchEntry?.(type);
    },
    [onDispatchEntry]
  );

  // User clicked "Dispatch Exit" in the gate plaza
  const handleUserDispatchExit = useCallback(() => {
    if (exitRef.current) return; // Lane B busy
    const occupied = slots.filter((s) => s.status === 'OCCUPIED');
    if (occupied.length === 0) return;
    const slot = occupied[0];
    // Trigger simulation state machine ONCE - visualization will sync automatically
    onDispatchExit?.(slot.id);
  }, [slots, onDispatchExit]);

  // Sync external state machine events (from buttons, Auto mode, or Left Panel)
  useEffect(() => {
    if (currentState === 'STATE_PROCESS_ENTRY' && !entryRef.current) {
      const type = lastEvent?.vehicleType || 'CAR';
      const id = lastEvent?.vehicleId;
      startEntryVisual(type, id);
    } else if (currentState === 'STATE_PROCESS_EXIT' && !exitRef.current) {
      startExitVisual(lastEvent?.slotId);
    }
  }, [currentState, lastEvent, startEntryVisual, startExitVisual]);

  // Lane 1 (Entry) Inbound Animation Loop: Left -> Right ➔
  useEffect(() => {
    if (!entryVehicle) {
      if (overrideA === 'AUTO') {
        setBarrierAngleA(0);
        setIrEntryBrokenA(false);
        setIrExitBrokenA(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setEntryVehicle((curr) => {
        if (!curr) return null;

        let nextProg = curr.progress + 2.2;
        let nextPhase = curr.phase;

        // Phase 1: Approach from Left (0% - 24%)
        if (nextProg < 24) {
          nextPhase = 'APPROACHING';
          setIrEntryBrokenA(false);
        }
        // Phase 2: Sensor Trip & Scan (24% - 34%)
        else if (nextProg >= 24 && nextProg < 34) {
          if (nextPhase !== 'IR_BLOCKED' && nextPhase !== 'PROCESSING') {
            nextPhase = 'IR_BLOCKED';
            setIrEntryBrokenA(true);
            simulationAudio.playSensorTrip();
            setEntryScanData({
              plate: curr.id,
              type: `${curr.type} [INBOUND]`,
              status: 'SCANNING RFID...',
            });
          }

          if (nextProg >= 28 && nextPhase === 'IR_BLOCKED') {
            nextPhase = 'PROCESSING';
            simulationAudio.playAccessGranted();
            setEntryScanData({
              plate: curr.id,
              type: `${curr.type} (${curr.type === 'CAR' ? '$20/h' : curr.type === 'BIKE' ? '$10/h' : '$40/h'})`,
              status: 'ACCESS GRANTED · TICKET ISSUED',
            });
          }
        }
        // Phase 3: Barrier A Lifts (34% - 44%)
        else if (nextProg >= 34 && nextProg < 44) {
          if (nextPhase !== 'BARRIER_RAISING') {
            nextPhase = 'BARRIER_RAISING';
            if (overrideA === 'AUTO') {
              simulationAudio.playServo(true);
              setBarrierAngleA(90);
            }
          }
        }
        // Phase 4: Pass Under Arm to the Right (44% - 70%)
        else if (nextProg >= 44 && nextProg < 70) {
          nextPhase = 'PASSING_GATE';
          setIrEntryBrokenA(false);
          if (nextProg >= 54) {
            setIrExitBrokenA(true);
          }
        }
        // Phase 5: Lower Barrier (70% - 85%)
        else if (nextProg >= 70 && nextProg < 85) {
          if (nextPhase !== 'BARRIER_LOWERING') {
            nextPhase = 'BARRIER_LOWERING';
            setIrExitBrokenA(false);
            if (overrideA === 'AUTO') {
              simulationAudio.playServo(false);
              setBarrierAngleA(0);
            }
          }
        }
        // Phase 6: Finished Ingress
        else if (nextProg >= 85) {
          return null;
        }

        return { ...curr, progress: nextProg, phase: nextPhase };
      });
    }, 45);

    return () => clearInterval(interval);
  }, [entryVehicle, overrideA]);

  // Lane 2 (Exit) Outbound Animation Loop: Right -> Left ⬅ (Opposite Direction)
  useEffect(() => {
    if (!exitVehicle) {
      if (overrideB === 'AUTO') {
        setBarrierAngleB(0);
        setIrEntryBrokenB(false);
        setIrExitBrokenB(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setExitVehicle((curr) => {
        if (!curr) return null;

        let nextProg = curr.progress + 2.2;
        let nextPhase = curr.phase;

        // Phase 1: Approach exit gate from the Right (0% - 24%)
        if (nextProg < 24) {
          nextPhase = 'APPROACHING';
          setIrEntryBrokenB(false);
        }
        // Phase 2: Sensor Trip & Payment Validation at right pay line (24% - 34%)
        else if (nextProg >= 24 && nextProg < 34) {
          if (nextPhase !== 'IR_BLOCKED' && nextPhase !== 'PROCESSING') {
            nextPhase = 'IR_BLOCKED';
            setIrEntryBrokenB(true);
            simulationAudio.playSensorTrip();
            setExitReceiptData({
              plate: curr.id,
              type: `${curr.type} [OUTBOUND]`,
              duration: `${curr.duration || 1.5}h parked`,
              fee: 'CALCULATING TARIFF...',
            });
          }

          if (nextProg >= 28 && nextPhase === 'IR_BLOCKED') {
            nextPhase = 'PROCESSING';
            simulationAudio.playPaymentSuccess();
            setExitReceiptData({
              plate: curr.id,
              type: curr.type,
              duration: `${curr.duration || 1.5}h parked`,
              fee: `$${curr.fee || 30}.00 PAID · RECEIPT CLEAR`,
            });
          }
        }
        // Phase 3: Barrier B Lifts (34% - 44%)
        else if (nextProg >= 34 && nextProg < 44) {
          if (nextPhase !== 'BARRIER_RAISING') {
            nextPhase = 'BARRIER_RAISING';
            if (overrideB === 'AUTO') {
              simulationAudio.playServo(true);
              setBarrierAngleB(90);
            }
          }
        }
        // Phase 4: Pass Under Arm to the Left towards Highway (44% - 70%)
        else if (nextProg >= 44 && nextProg < 70) {
          nextPhase = 'PASSING_GATE';
          setIrEntryBrokenB(false);
          if (nextProg >= 54) {
            setIrExitBrokenB(true);
          }
        }
        // Phase 5: Lower Barrier B (70% - 85%)
        else if (nextProg >= 70 && nextProg < 85) {
          if (nextPhase !== 'BARRIER_LOWERING') {
            nextPhase = 'BARRIER_LOWERING';
            setIrExitBrokenB(false);
            if (overrideB === 'AUTO') {
              simulationAudio.playServo(false);
              setBarrierAngleB(0);
            }
          }
        }
        // Phase 6: Exit complete to the Left
        else if (nextProg >= 85) {
          return null;
        }

        return { ...curr, progress: nextProg, phase: nextPhase };
      });
    }, 45);

    return () => clearInterval(interval);
  }, [exitVehicle, overrideB]);

  // Handle overrides
  useEffect(() => {
    if (overrideA === 'FORCE_OPEN') setBarrierAngleA(90);
    else if (overrideA === 'FORCE_CLOSED') setBarrierAngleA(0);
  }, [overrideA]);

  useEffect(() => {
    if (overrideB === 'FORCE_OPEN') setBarrierAngleB(90);
    else if (overrideB === 'FORCE_CLOSED') setBarrierAngleB(0);
  }, [overrideB]);

  const isGateAOpen = overrideA === 'FORCE_OPEN' || barrierAngleA > 45;
  const isGateBOpen = overrideB === 'FORCE_OPEN' || barrierAngleB > 45;

  const occupiedCount = slots.filter((s) => s.status === 'OCCUPIED').length;

  return (
    <Card className="bg-card/75 border-border overflow-hidden shadow-2xl">
      {/* Plaza Master Header */}
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-border/50 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
            {(isGateAOpen || isGateBOpen) && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              Smart Gate Plaza · 2-Way Opposite Flow
              <Badge variant="outline" className="text-[9px] font-mono bg-cyan-950/40 text-cyan-300 border-cyan-800/60">
                ➔ INBOUND + ⬅ OUTBOUND
              </Badge>
            </CardTitle>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleAudio}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-cyan-300"
            title={audioEnabled ? 'Mute Sound Effects' : 'Enable Web Audio Synth'}
          >
            {audioEnabled ? <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> : <VolumeX className="h-3.5 w-3.5" />}
          </Button>

          <Badge
            variant={isGateAOpen ? 'default' : 'secondary'}
            className={cn(
              'font-mono text-[9px] px-1.5 py-0.5',
              isGateAOpen ? 'bg-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-800 text-slate-300'
            )}
          >
            GATE A [➔]: {barrierAngleA}°
          </Badge>

          <Badge
            variant={isGateBOpen ? 'default' : 'secondary'}
            className={cn(
              'font-mono text-[9px] px-1.5 py-0.5',
              isGateBOpen ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-slate-800 text-slate-300'
            )}
          >
            GATE B [⬅]: {barrierAngleB}°
          </Badge>

          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/50">
            T:{simTime}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        {/* ========================================================================= */}
        {/* LANE 1: INBOUND ENTRY LANE (LANE A) ➔ DRIVING LEFT TO RIGHT              */}
        {/* ========================================================================= */}
        <div className="relative bg-[#070b14] rounded-lg border border-cyan-900/40 overflow-hidden shadow-inner flex flex-col justify-end">
          {/* Lane 1 Header Ribbon */}
          <div className="px-3 py-1 bg-slate-900/90 border-b border-cyan-900/30 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <LogIn className="h-3.5 w-3.5 text-cyan-400" />
              <span>LANE 1: ENTRY GATE A [INBOUND ➔]</span>
              <span className="text-slate-500 font-normal">STREET ➔ TO PARKING LOT</span>
            </div>

            {/* Inbound HUD Scanner */}
            {entryScanData ? (
              <div className="flex items-center gap-1.5 text-emerald-300 animate-in fade-in">
                <Scan className="h-3 w-3 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span>{entryScanData.plate} [{entryScanData.type}] · {entryScanData.status}</span>
              </div>
            ) : (
              <span className={cn('text-[9px] font-mono', isGateAOpen ? 'text-cyan-300 font-bold animate-pulse' : 'text-slate-500')}>
                [{isGateAOpen ? 'LPC_PWM1.1 · SERVO 90° · GATE RAISED' : 'LPC_PWM1.1 · SERVO 0° · STANDBY'}]
              </span>
            )}
          </div>

          {/* Roadway Canvas Lane A: Enlarged Display Screen for Full 90° Boom Arm Visibility */}
          <div className="relative w-full h-40 bg-[#12141a] border-t border-slate-600/70 flex items-end overflow-hidden select-none">
            {/* Realistic Highway Asphalt Surface */}
            <div
              className="absolute inset-0 bg-[#16181f]"
              style={{
                backgroundImage: `
                  radial-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px),
                  linear-gradient(to bottom, #232731 0%, #171a22 45%, #101218 100%)
                `,
                backgroundSize: '8px 8px, 100% 100%',
              }}
            >
              {/* Overhead Highway Canopy Ambient Lighting Cone */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_36%_0%,rgba(255,255,255,0.12)_0%,transparent_100%)]" />

              {/* Realistic Dual Asphalt Tire Track Wear Grooves */}
              <div className="absolute top-[26%] left-0 right-0 h-4 bg-black/35 blur-[2.5px] pointer-events-none" />
              <div className="absolute bottom-[24%] left-0 right-0 h-4 bg-black/35 blur-[2.5px] pointer-events-none" />

              {/* Upper Concrete Highway Guardrail / Shoulder Curb */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 border-b border-slate-500/80 flex items-center justify-around px-4 shadow-sm">
                <div className="w-2 h-1 bg-amber-400 rounded-xs shadow-[0_0_5px_#f59e0b]" />
                <div className="w-2 h-1 bg-white rounded-xs shadow-[0_0_5px_#ffffff]" />
                <div className="w-2 h-1 bg-amber-400 rounded-xs shadow-[0_0_5px_#f59e0b]" />
                <div className="w-2 h-1 bg-white rounded-xs shadow-[0_0_5px_#ffffff]" />
                <div className="w-2 h-1 bg-amber-400 rounded-xs shadow-[0_0_5px_#f59e0b]" />
                <div className="w-2 h-1 bg-white rounded-xs shadow-[0_0_5px_#ffffff]" />
                <div className="w-2 h-1 bg-amber-400 rounded-xs shadow-[0_0_5px_#f59e0b]" />
              </div>

              {/* Highway White Shoulder Edge Line (Top) */}
              <div className="absolute top-3 left-0 right-0 h-[2.5px] bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.4)]" />

              {/* Thermoplastic Highway Directional Arrow Painted on Road (Approach Side) */}
              <div className="absolute left-[7%] top-[34%] pointer-events-none opacity-60">
                <svg width="30" height="14" viewBox="0 0 30 14" fill="none">
                  <path d="M0 5h18V1l12 6-12 6V9H0V5z" fill="#f8fafc" />
                </svg>
              </div>

              {/* Thermoplastic Highway Directional Arrow Painted on Road (Departure Side) */}
              <div className="absolute left-[84%] top-[34%] pointer-events-none opacity-60">
                <svg width="30" height="14" viewBox="0 0 30 14" fill="none">
                  <path d="M0 5h18V1l12 6-12 6V9H0V5z" fill="#f8fafc" />
                </svg>
              </div>

              {/* Highway Inductive Vehicle Detector Loops in Pavement */}
              <div className="absolute left-[13%] bottom-3 w-16 h-8 rounded-sm border border-emerald-400/30 bg-emerald-500/[0.05] pointer-events-none flex items-center justify-center shadow-[inset_0_0_6px_rgba(16,185,129,0.15)]">
                <span className="text-[6.5px] font-mono text-emerald-400/60 font-semibold tracking-wider">LOOP_A1</span>
              </div>
              <div className="absolute left-[77%] bottom-3 w-16 h-8 rounded-sm border border-cyan-400/30 bg-cyan-500/[0.05] pointer-events-none flex items-center justify-center shadow-[inset_0_0_6px_rgba(6,182,212,0.15)]">
                <span className="text-[6.5px] font-mono text-cyan-400/60 font-semibold tracking-wider">LOOP_A2</span>
              </div>

              {/* Highway Directional Stencil Markings */}
              <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-[9px] text-slate-300/80 font-mono font-bold tracking-widest pointer-events-none">
                <span className="flex items-center gap-1.5"><span className="text-amber-400">➔➔</span> APPROACH LANE</span>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">➔➔</span> TOLL PLAZA ENTRY</span>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">➔➔</span> LOT INBOUND</span>
              </div>

              {/* Painted Highway Pavement Stencils */}
              <div className="absolute left-[17%] bottom-4 pointer-events-none text-[7.5px] font-mono font-black tracking-widest text-white/50 border border-white/20 px-1 py-0.5 rounded-xs select-none">
                SLOW 15 MPH
              </div>

              {/* Highway Center Yellow Dashed Divider with Cat-Eye Reflectors */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] flex items-center">
                <div
                  className="w-full h-[2px]"
                  style={{
                    background: 'repeating-linear-gradient(90deg, #f59e0b 0px, #f59e0b 24px, transparent 24px, transparent 48px)',
                  }}
                />
                {/* Embedded Highway Cat-Eye Road Studs */}
                <div className="absolute inset-x-0 flex justify-around pointer-events-none">
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                </div>
              </div>

              {/* Transverse Rumble Strips before Stop Bar */}
              <div
                className="absolute left-[24%] top-4 bottom-3 w-6 pointer-events-none opacity-50"
                style={{
                  background: 'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 2px, transparent 2px, transparent 6px)',
                }}
              />

              {/* Solid White Stop Bar A */}
              <div className="absolute left-[33%] top-3 bottom-1.5 w-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <div className="absolute left-[30.5%] bottom-4 text-[8px] font-mono font-black tracking-widest text-white/80 -rotate-90 select-none">
                STOP
              </div>

              {/* Island Approach Chevron Buffer Zone (Yellow Diagonal Hatching) */}
              <div
                className="absolute left-[34%] bottom-0 w-16 h-8 pointer-events-none opacity-30"
                style={{
                  background: 'repeating-linear-gradient(45deg, #eab308 0px, #eab308 2.5px, transparent 2.5px, transparent 7px)',
                  clipPath: 'polygon(0% 100%, 25% 0%, 100% 0%, 100% 100%)'
                }}
              />

              {/* Highway Shoulder Storm Drain Grate */}
              <div className="absolute left-[3%] bottom-0.5 w-7 h-2 rounded-xs border border-slate-700 bg-slate-900/90 pointer-events-none flex justify-around items-center px-0.5">
                <div className="w-0.5 h-1.5 bg-slate-600" />
                <div className="w-0.5 h-1.5 bg-slate-600" />
                <div className="w-0.5 h-1.5 bg-slate-600" />
                <div className="w-0.5 h-1.5 bg-slate-600" />
              </div>

              {/* Bottom Concrete Highway Curb & Shoulder Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-t from-slate-600 to-slate-800 border-t border-slate-500" />
              <div className="absolute bottom-2 left-0 right-0 h-[2px] bg-white/70 shadow-[0_0_3px_rgba(255,255,255,0.3)]" />
            </div>

            {/* Entry IR Beam A */}
            <div className="absolute left-[30%] inset-y-0 w-6 pointer-events-none z-20 flex flex-col items-center">
              <div className="w-2 h-2.5 bg-slate-800 border border-slate-600 rounded-t-sm" />
              <div
                className={cn(
                  'w-0.5 flex-1 transition-all duration-150',
                  irEntryBrokenA
                    ? 'bg-red-500 shadow-[0_0_8px_#ef4444] opacity-100 animate-pulse'
                    : 'bg-cyan-400/60 shadow-[0_0_5px_#22d3ee] opacity-70'
                )}
              />
              <div className="w-2 h-2.5 bg-slate-800 border border-slate-600 rounded-b-sm" />
            </div>

            {/* Exit IR Beam A */}
            <div className="absolute left-[66%] inset-y-0 w-6 pointer-events-none z-20 flex flex-col items-center">
              <div className="w-2 h-2.5 bg-slate-800 border border-slate-600 rounded-t-sm" />
              <div
                className={cn(
                  'w-0.5 flex-1 transition-all duration-150',
                  irExitBrokenA
                    ? 'bg-red-500 shadow-[0_0_8px_#ef4444] opacity-100 animate-pulse'
                    : 'bg-emerald-400/50 shadow-[0_0_5px_#34d399] opacity-70'
                )}
              />
              <div className="w-2 h-2.5 bg-slate-800 border border-slate-600 rounded-b-sm" />
            </div>

            {/* Transiting Vehicle A: Drives Left -> Right ➔ (Normal Orientation) */}
            {entryVehicle && (
              <div
                className="absolute bottom-2 z-20 transition-all duration-75 flex flex-col items-center"
                style={{
                  left: `${Math.min(94, Math.max(-5, entryVehicle.progress))}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="mb-0.5 bg-slate-950/90 border border-cyan-400/80 rounded px-1 py-0.2 shadow">
                  <span className="text-[7.5px] font-mono font-bold text-cyan-300">{entryVehicle.id}</span>
                </div>
                <VehicleVisual
                  type={entryVehicle.type}
                  color={entryVehicle.color}
                  className="h-8 w-18 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]"
                  isAnimated={true}
                />
              </div>
            )}

            {/* Boom Barrier Structure A (Position: 36%) */}
            <div className="absolute left-[36%] bottom-0 z-30 flex flex-col items-center pointer-events-none">
              {/* Traffic Light A - Enhanced High-Contrast for LinkedIn Video */}
              <div className="bg-[#0b0f19] border border-slate-600 rounded-full px-1 py-1.5 flex flex-col gap-1.5 mb-0.5 shadow-2xl">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-200',
                    !isGateAOpen
                      ? 'bg-red-500 shadow-[0_0_12px_#ef4444] ring-1 ring-red-400/80'
                      : 'bg-red-950/60 opacity-30'
                  )}
                />
                <div
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-200',
                    isGateAOpen
                      ? 'bg-emerald-400 shadow-[0_0_14px_#34d399] ring-1 ring-emerald-300'
                      : 'bg-emerald-950/60 opacity-30'
                  )}
                />
              </div>

              {/* Stanchion Housing A */}
              <div className="w-7 h-13 bg-gradient-to-t from-slate-900 to-slate-700 rounded-t border border-slate-600 relative flex items-center justify-center shadow-xl">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-yellow-400 shadow z-30" />

                {/* Barrier Arm A: Sized and rotated to be 100% visible when fully raised to 90° */}
                <div
                  className="absolute left-3.5 w-32 h-2.5 rounded-r origin-left transition-transform duration-500 ease-out z-20 shadow-lg border border-yellow-400/50"
                  style={{
                    transform: `rotate(-${barrierAngleA}deg)`,
                    background: 'repeating-linear-gradient(45deg, #dc2626, #dc2626 8px, #ffffff 8px, #ffffff 16px)',
                  }}
                >
                  <div
                    className={cn(
                      'ml-auto mr-1 w-1.5 h-1.5 rounded-full',
                      isGateAOpen ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500 animate-pulse'
                    )}
                  />
                </div>
              </div>

              {/* Concrete Toll Island Curb with High-visibility hazard stripes */}
              <div className="w-12 h-2.5 rounded-t bg-gradient-to-t from-slate-800 to-slate-700 border-t border-x border-slate-500 flex flex-col items-center justify-end shadow-md -mt-0.5">
                <div
                  className="w-full h-1.5 border-t border-amber-500/60"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #eab308, #eab308 4px, #0f172a 4px, #0f172a 8px)'
                  }}
                />
              </div>
            </div>

            {/* Receiving Rest Post A on Concrete Base */}
            <div className="absolute left-[62%] bottom-0 flex flex-col items-center z-10 pointer-events-none">
              <div className="w-3.5 h-10 bg-gradient-to-t from-slate-900 to-slate-700 rounded-t border border-slate-600 shadow" />
              <div className="w-6 h-1.5 bg-slate-700 border-t border-slate-500 rounded-t" />
            </div>
          </div>

          {/* Lane A Controls Strip */}
          <div className="bg-slate-950/90 border-t border-border/40 px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <span>Inbound ➔</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUserDispatchEntry('CAR')}
                className="h-5 text-[8.5px] px-1.5 bg-cyan-950/30 hover:bg-cyan-900/50 border-cyan-800/60 text-cyan-300"
              >
                🪪 Tap Car ($20)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUserDispatchEntry('BIKE')}
                className="h-5 text-[8.5px] px-1.5 bg-emerald-950/30 hover:bg-emerald-900/50 border-emerald-800/60 text-emerald-300"
              >
                🪪 Tap Bike ($10)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUserDispatchEntry('TRUCK')}
                className="h-5 text-[8.5px] px-1.5 bg-amber-950/30 hover:bg-amber-900/50 border-amber-800/60 text-amber-300"
              >
                🪪 Tap Truck ($40)
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">PWM1.1: {isGateAOpen ? '2.0ms' : '1.0ms'}</span>
              <Button
                size="sm"
                variant={overrideA === 'FORCE_OPEN' ? 'destructive' : 'outline'}
                onClick={() => setOverrideA((prev) => (prev === 'FORCE_OPEN' ? 'AUTO' : 'FORCE_OPEN'))}
                className={cn(
                  'h-5 text-[8.5px] px-2 font-mono transition-all',
                  overrideA === 'FORCE_OPEN' ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500 font-bold' : 'hover:border-cyan-500'
                )}
              >
                {overrideA === 'FORCE_OPEN' ? 'Release Gate A' : 'Force Open A'}
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTRAL CONCRETE HIGHWAY MEDIAN BARRIER WITH REFLECTORS                  */}
        {/* ========================================================================= */}
        <div className="relative py-1.5 px-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y-2 border-amber-500/50 rounded flex items-center justify-between text-[9px] font-mono tracking-wider text-amber-300 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_100%)] pointer-events-none" />
          <div className="relative flex items-center gap-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <span>➔</span> INBOUND APPROACH
            </span>
            <span className="text-slate-600 font-bold">|</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
              HIGHWAY CONCRETE MEDIAN · TOLL PLAZA DIVIDER
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
            </span>
            <span className="text-slate-600 font-bold">|</span>
            <span className="text-purple-400 font-bold flex items-center gap-1">
              EXPRESSWAY MERGE <span>⬅</span>
            </span>
          </div>
          <span className="relative text-[8px] text-slate-400 font-medium tracking-normal">DUAL OPPOSITE FLOW · LPC1768 CORTEX-M3</span>
        </div>

        {/* ========================================================================= */}
        {/* LANE 2: OUTBOUND EXIT LANE (LANE B) ⬅ DRIVING RIGHT TO LEFT              */}
        {/* ========================================================================= */}
        <div className="relative bg-[#070b14] rounded-lg border border-purple-900/40 overflow-hidden shadow-inner flex flex-col justify-end">
          {/* Lane 2 Header Ribbon */}
          <div className="px-3 py-1 bg-slate-900/90 border-b border-purple-900/30 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold">
              <LogOut className="h-3.5 w-3.5 text-purple-400" />
              <span>LANE 2: EXIT GATE B [OUTBOUND ⬅]</span>
              <span className="text-slate-500 font-normal">PARKING LOT ➔ TO CITY HIGHWAY</span>
            </div>

            {/* Outbound HUD Payment / Receipt */}
            {exitReceiptData ? (
              <div className="flex items-center gap-1.5 text-emerald-300 animate-in fade-in">
                <Receipt className="h-3 w-3 text-purple-400" />
                <span>{exitReceiptData.plate} [{exitReceiptData.type}] · {exitReceiptData.duration} · <strong className="text-yellow-300">{exitReceiptData.fee}</strong></span>
              </div>
            ) : (
              <span className={cn('text-[9px] font-mono', isGateBOpen ? 'text-purple-300 font-bold animate-pulse' : 'text-slate-500')}>
                [{isGateBOpen ? 'LPC_PWM1.2 · SERVO 90° · GATE RAISED' : 'LPC_PWM1.2 · SERVO 0° · STANDBY'}]
              </span>
            )}
          </div>

          {/* Roadway Canvas Lane B: Enlarged Display Screen for Full 90° Boom Arm Visibility */}
          <div className="relative w-full h-40 bg-[#12141a] border-t border-slate-600/70 flex items-end overflow-hidden select-none">
            {/* Realistic Highway Asphalt Surface */}
            <div
              className="absolute inset-0 bg-[#16181f]"
              style={{
                backgroundImage: `
                  radial-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px),
                  linear-gradient(to bottom, #232731 0%, #171a22 45%, #101218 100%)
                `,
                backgroundSize: '8px 8px, 100% 100%',
              }}
            >
              {/* Overhead Highway Canopy Ambient Lighting Cone (Focused on Gate B Stanchion 63%) */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_63%_0%,rgba(255,255,255,0.12)_0%,transparent_100%)]" />

              {/* Realistic Dual Asphalt Tire Track Wear Grooves */}
              <div className="absolute top-[26%] left-0 right-0 h-4 bg-black/35 blur-[2.5px] pointer-events-none" />
              <div className="absolute bottom-[24%] left-0 right-0 h-4 bg-black/35 blur-[2.5px] pointer-events-none" />

              {/* Upper Concrete Highway Guardrail / Shoulder Curb */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 border-b border-slate-500/80 flex items-center justify-around px-4 shadow-sm">
                <div className="w-2 h-1 bg-amber-400 rounded-xs shadow-[0_0_5px_#f59e0b]" />
                <div className="w-2 h-1 bg-white rounded-xs shadow-[0_0_5px_#ffffff]" />
                <div className="w-2 h-1 bg-amber-400 rounded-xs shadow-[0_0_5px_#f59e0b]" />
                <div className="w-2 h-1 bg-white rounded-xs shadow-[0_0_5px_#ffffff]" />
                <div className="w-2 h-1 bg-amber-400 rounded-xs shadow-[0_0_5px_#f59e0b]" />
                <div className="w-2 h-1 bg-white rounded-xs shadow-[0_0_5px_#ffffff]" />
                <div className="w-2 h-1 bg-amber-400 rounded-xs shadow-[0_0_5px_#f59e0b]" />
              </div>

              {/* Highway White Shoulder Edge Line (Top) */}
              <div className="absolute top-3 left-0 right-0 h-[2.5px] bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.4)]" />

              {/* Thermoplastic Highway Directional Arrow Painted on Road (Leftward ⬅ Exit Flow) */}
              <div className="absolute left-[8%] top-[34%] pointer-events-none opacity-60">
                <svg width="30" height="14" viewBox="0 0 30 14" fill="none">
                  <path d="M30 5H12V1L0 7l12 6V9h18V5z" fill="#f8fafc" />
                </svg>
              </div>

              {/* Thermoplastic Highway Directional Arrow Painted on Road (Approach Side ⬅) */}
              <div className="absolute left-[85%] top-[34%] pointer-events-none opacity-60">
                <svg width="30" height="14" viewBox="0 0 30 14" fill="none">
                  <path d="M30 5H12V1L0 7l12 6V9h18V5z" fill="#f8fafc" />
                </svg>
              </div>

              {/* Highway Inductive Vehicle Detector Loops in Pavement */}
              <div className="absolute left-[75%] bottom-3 w-16 h-8 rounded-sm border border-purple-400/30 bg-purple-500/[0.05] pointer-events-none flex items-center justify-center shadow-[inset_0_0_6px_rgba(168,85,247,0.15)]">
                <span className="text-[6.5px] font-mono text-purple-400/60 font-semibold tracking-wider">LOOP_B1</span>
              </div>
              <div className="absolute left-[13%] bottom-3 w-16 h-8 rounded-sm border border-emerald-400/30 bg-emerald-500/[0.05] pointer-events-none flex items-center justify-center shadow-[inset_0_0_6px_rgba(16,185,129,0.15)]">
                <span className="text-[6.5px] font-mono text-emerald-400/60 font-semibold tracking-wider">LOOP_B2</span>
              </div>

              {/* Highway Directional Stencil Markings (Leftward Direction ⬅) */}
              <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-[9px] text-slate-300/80 font-mono font-bold tracking-widest pointer-events-none">
                <span className="flex items-center gap-1.5"><span className="text-amber-400">⬅⬅</span> EXPRESSWAY MERGE</span>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">⬅⬅</span> TOLL CLEARANCE</span>
                <span className="flex items-center gap-1.5"><span className="text-amber-400">⬅⬅</span> LOT EXIT</span>
              </div>

              {/* Painted Highway Pavement Stencils */}
              <div className="absolute left-[78%] bottom-4 pointer-events-none text-[7.5px] font-mono font-black tracking-widest text-white/50 border border-white/20 px-1 py-0.5 rounded-xs select-none">
                PAY TOLL
              </div>

              {/* Highway Center Yellow Dashed Divider with Cat-Eye Reflectors */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] flex items-center">
                <div
                  className="w-full h-[2px]"
                  style={{
                    background: 'repeating-linear-gradient(90deg, #f59e0b 0px, #f59e0b 24px, transparent 24px, transparent 48px)',
                  }}
                />
                {/* Embedded Highway Cat-Eye Road Studs */}
                <div className="absolute inset-x-0 flex justify-around pointer-events-none">
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                  <div className="w-1.5 h-1 bg-amber-400 rounded-xs shadow-[0_0_6px_#f59e0b]" />
                </div>
              </div>

              {/* Transverse Rumble Strips before Pay Stop Bar (approaching from right: 73%) */}
              <div
                className="absolute left-[73%] top-4 bottom-3 w-6 pointer-events-none opacity-50"
                style={{
                  background: 'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 2px, transparent 2px, transparent 6px)',
                }}
              />

              {/* Solid White Pay Bar B */}
              <div className="absolute left-[67%] top-3 bottom-1.5 w-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <div className="absolute left-[68.5%] bottom-4 text-[8px] font-mono font-black tracking-widest text-white/80 -rotate-90 select-none">
                PAY
              </div>

              {/* Island Approach Chevron Buffer Zone (Yellow Diagonal Hatching facing incoming traffic) */}
              <div
                className="absolute left-[61%] bottom-0 w-16 h-8 pointer-events-none opacity-30"
                style={{
                  background: 'repeating-linear-gradient(-45deg, #eab308 0px, #eab308 2.5px, transparent 2.5px, transparent 7px)',
                  clipPath: 'polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)'
                }}
              />

              {/* Highway Shoulder Storm Drain Grate */}
              <div className="absolute right-[3%] bottom-0.5 w-7 h-2 rounded-xs border border-slate-700 bg-slate-900/90 pointer-events-none flex justify-around items-center px-0.5">
                <div className="w-0.5 h-1.5 bg-slate-600" />
                <div className="w-0.5 h-1.5 bg-slate-600" />
                <div className="w-0.5 h-1.5 bg-slate-600" />
                <div className="w-0.5 h-1.5 bg-slate-600" />
              </div>

              {/* Bottom Concrete Highway Curb & Shoulder Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-t from-slate-600 to-slate-800 border-t border-slate-500" />
              <div className="absolute bottom-2 left-0 right-0 h-[2px] bg-white/70 shadow-[0_0_3px_rgba(255,255,255,0.3)]" />
            </div>

            {/* Inbound Approach IR Beam B (on right approach side: 70%) */}
            <div className="absolute left-[70%] inset-y-0 w-6 pointer-events-none z-20 flex flex-col items-center">
              <div className="w-2 h-2.5 bg-slate-800 border border-slate-600 rounded-t-sm" />
              <div
                className={cn(
                  'w-0.5 flex-1 transition-all duration-150',
                  irEntryBrokenB
                    ? 'bg-red-500 shadow-[0_0_8px_#ef4444] opacity-100 animate-pulse'
                    : 'bg-purple-400/60 shadow-[0_0_5px_#c084fc] opacity-70'
                )}
              />
              <div className="w-2 h-2.5 bg-slate-800 border border-slate-600 rounded-b-sm" />
            </div>

            {/* Clearance IR Beam B (on highway exit side: 28%) */}
            <div className="absolute left-[28%] inset-y-0 w-6 pointer-events-none z-20 flex flex-col items-center">
              <div className="w-2 h-2.5 bg-slate-800 border border-slate-600 rounded-t-sm" />
              <div
                className={cn(
                  'w-0.5 flex-1 transition-all duration-150',
                  irExitBrokenB
                    ? 'bg-red-500 shadow-[0_0_8px_#ef4444] opacity-100 animate-pulse'
                    : 'bg-emerald-400/50 shadow-[0_0_5px_#34d399] opacity-70'
                )}
              />
              <div className="w-2 h-2.5 bg-slate-800 border border-slate-600 rounded-b-sm" />
            </div>

            {/* Transiting Vehicle B: Drives Right -> Left ⬅ (Horizontally Flipped so headlights point left!) */}
            {exitVehicle && (
              <div
                className="absolute bottom-2 z-20 transition-all duration-75 flex flex-col items-center"
                style={{
                  left: `${Math.min(96, Math.max(-8, 96 - exitVehicle.progress))}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Plate label remains readable (unflipped) */}
                <div className="mb-0.5 bg-slate-950/90 border border-purple-400/80 rounded px-1 py-0.2 shadow">
                  <span className="text-[7.5px] font-mono font-bold text-purple-300">{exitVehicle.id}</span>
                </div>
                {/* Vehicle SVG horizontally mirrored to face LEFTWARDS */}
                <div style={{ transform: 'scaleX(-1)' }}>
                  <VehicleVisual
                    type={exitVehicle.type}
                    color={exitVehicle.color}
                    className="h-8 w-18 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]"
                    isAnimated={true}
                  />
                </div>
              </div>
            )}

            {/* Receiving Rest Post B on Concrete Base (Position: 38% on the left towards highway) */}
            <div className="absolute left-[38%] bottom-0 flex flex-col items-center z-10 pointer-events-none">
              <div className="w-3.5 h-10 bg-gradient-to-t from-slate-900 to-slate-700 rounded-t border border-slate-600 shadow" />
              <div className="w-6 h-1.5 bg-slate-700 border-t border-slate-500 rounded-t" />
            </div>

            {/* Rotated Boom Barrier Structure B (Position: 63% on the right facing oncoming exit traffic) */}
            <div className="absolute left-[63%] bottom-0 z-30 flex flex-col items-center pointer-events-none">
              {/* Traffic Light B - Enhanced High-Contrast for LinkedIn Video */}
              <div className="bg-[#0b0f19] border border-slate-600 rounded-full px-1 py-1.5 flex flex-col gap-1.5 mb-0.5 shadow-2xl">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-200',
                    !isGateBOpen
                      ? 'bg-red-500 shadow-[0_0_12px_#ef4444] ring-1 ring-red-400/80'
                      : 'bg-red-950/60 opacity-30'
                  )}
                />
                <div
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-200',
                    isGateBOpen
                      ? 'bg-emerald-400 shadow-[0_0_14px_#34d399] ring-1 ring-emerald-300'
                      : 'bg-emerald-950/60 opacity-30'
                  )}
                />
              </div>

              {/* Stanchion Housing B */}
              <div className="w-7 h-13 bg-gradient-to-t from-slate-900 to-slate-700 rounded-t border border-slate-600 relative flex items-center justify-center shadow-xl">
                {/* Servo Motor Pivot Gear B */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-yellow-400 shadow z-30" />

                {/* Rotated Boom Barrier Arm B: Extends LEFTWARDS towards 38%, Hinged on the RIGHT (origin-right) */}
                <div
                  className="absolute right-3.5 w-32 h-2.5 rounded-l origin-right transition-transform duration-500 ease-out z-20 shadow-lg border border-yellow-400/50"
                  style={{
                    transform: `rotate(${barrierAngleB}deg)`,
                    background: 'repeating-linear-gradient(45deg, #7c3aed, #7c3aed 8px, #ffffff 8px, #ffffff 16px)',
                  }}
                >
                  {/* Warning Strobe at Tip (Left end) */}
                  <div
                    className={cn(
                      'mr-auto ml-1 w-1.5 h-1.5 rounded-full',
                      isGateBOpen ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500 animate-pulse'
                    )}
                  />
                </div>
              </div>

              {/* Concrete Toll Island Curb with High-visibility hazard stripes */}
              <div className="w-12 h-2.5 rounded-t bg-gradient-to-t from-slate-800 to-slate-700 border-t border-x border-slate-500 flex flex-col items-center justify-end shadow-md -mt-0.5">
                <div
                  className="w-full h-1.5 border-t border-amber-500/60"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #eab308, #eab308 4px, #0f172a 4px, #0f172a 8px)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Lane B Controls Strip */}
          <div className="bg-slate-950/90 border-t border-border/40 px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <span>⬅ Outbound</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={occupiedCount === 0}
                onClick={handleUserDispatchExit}
                className="h-5 text-[8.5px] px-2 bg-purple-950/30 hover:bg-purple-900/50 border-purple-800/60 text-purple-300"
                title={occupiedCount === 0 ? 'No parked cars to exit' : 'Exit a parked vehicle'}
              >
                <LogOut className="h-2.5 w-2.5 mr-1" />
                💳 Pay & Exit ({occupiedCount} Occupied)
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">PWM1.2: {isGateBOpen ? '2.0ms' : '1.0ms'}</span>
              <Button
                size="sm"
                variant={overrideB === 'FORCE_OPEN' ? 'destructive' : 'outline'}
                onClick={() => setOverrideB((prev) => (prev === 'FORCE_OPEN' ? 'AUTO' : 'FORCE_OPEN'))}
                className={cn(
                  'h-5 text-[8.5px] px-2 font-mono transition-all',
                  overrideB === 'FORCE_OPEN' ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500 font-bold' : 'hover:border-purple-500'
                )}
              >
                {overrideB === 'FORCE_OPEN' ? 'Release Gate B' : 'Force Open B'}
              </Button>
            </div>
          </div>
        </div>

        {/* Telemetry Summary Bar */}
        <div className="bg-muted/20 p-2 rounded-lg border border-border/50 text-[10px] font-mono grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
          <div>
            <span className="text-muted-foreground">Lane 1 Servo A: </span>
            <span className={cn('font-bold', isGateAOpen ? 'text-emerald-400' : 'text-slate-300')}>
              {barrierAngleA}° (Inbound ➔)
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Lane 2 Servo B: </span>
            <span className={cn('font-bold', isGateBOpen ? 'text-purple-400' : 'text-slate-300')}>
              {barrierAngleB}° (Outbound ⬅)
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">GPIO Port 0 (A): </span>
            <span className="text-cyan-300">{irEntryBrokenA ? 'P0.4 TRIP' : 'P0.4 CLEAR'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">GPIO Port 2 (B): </span>
            <span className="text-purple-300">{irEntryBrokenB ? 'P2.0 TRIP' : 'P2.0 CLEAR'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

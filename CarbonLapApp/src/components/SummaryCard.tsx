import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGrad, Stop, Rect } from 'react-native-svg';
import { Colors } from '../theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SummaryCardProps {
  driverName: string;
  driverNumber: string;
  co2Saved: number;
  mjHarvested: number;
  efficiency: number;
  teamColor?: string;
  teamName?: string;
  raceName?: string;
}

// ─── Arc Gauge (uses Path, no rotation transform - works on web) ───────────────
function ArcGauge({ value, max, color, label, unit, gradId }: {
  value: number; max: number; color: string; label: string; unit: string; gradId: string;
}) {
  const W = 80; const H = 60;
  const CX = W / 2; const CY = H - 8;
  const R = 28;
  const progress = Math.min(value / max, 1);

  // Build arc paths manually — no rotation needed
  function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const sx = cx + r * Math.cos(toRad(startDeg));
    const sy = cy + r * Math.sin(toRad(startDeg));
    const ex = cx + r * Math.cos(toRad(endDeg));
    const ey = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
  }

  const START = 200; // degrees (from right = 0°, going clockwise)
  const SPAN = 140;  // total arc spans 140°
  const trackEnd = START + SPAN;
  const fillEnd = START + SPAN * progress;

  return (
    <View style={gSty.wrap}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <SvgGrad id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="1" />
          </SvgGrad>
        </Defs>
        {/* Track */}
        <Path d={arc(CX, CY, R, START, trackEnd)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} strokeLinecap="round" />
        {/* Fill */}
        {progress > 0 && (
          <Path d={arc(CX, CY, R, START, fillEnd)} fill="none" stroke={`url(#${gradId})`} strokeWidth={5} strokeLinecap="round" />
        )}
      </Svg>
      {/* Center text sits inside the arc's open bottom */}
      <View style={gSty.centerText}>
        <Text style={[gSty.val, { color }]}>{value < 10 ? value.toFixed(1) : Math.round(value)}</Text>
        <Text style={gSty.unit}>{unit}</Text>
      </View>
      <Text style={gSty.label}>{label}</Text>
    </View>
  );
}
const gSty = StyleSheet.create({
  wrap: { alignItems: 'center', width: 80 },
  centerText: { position: 'absolute', top: 22, alignItems: 'center', width: 80 },
  val: { fontSize: 16, fontWeight: '900', lineHeight: 18 },
  unit: { fontSize: 8, color: Colors.LIGHT_GRAY, letterSpacing: 1, fontWeight: '600' },
  label: { fontSize: 8, color: Colors.GRAY, letterSpacing: 2, fontWeight: '700', marginTop: -2 },
});

// ─── QR Corner Decoration ─────────────────────────────────────────────────────
function QrDeco({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" opacity={0.55}>
      <Rect x={1} y={1} width={10} height={10} fill="none" stroke={color} strokeWidth={1.5} rx={1} />
      <Rect x={4} y={4} width={4} height={4} fill={color} rx={0.5} />
      <Rect x={17} y={1} width={10} height={10} fill="none" stroke={color} strokeWidth={1.5} rx={1} />
      <Rect x={20} y={4} width={4} height={4} fill={color} rx={0.5} />
      <Rect x={1} y={17} width={10} height={10} fill="none" stroke={color} strokeWidth={1.5} rx={1} />
      <Rect x={4} y={20} width={4} height={4} fill={color} rx={0.5} />
      <Rect x={17} y={17} width={4} height={4} fill={color} rx={0.5} />
      <Rect x={23} y={17} width={4} height={4} fill={color} rx={0.5} />
      <Rect x={17} y={23} width={4} height={4} fill={color} rx={0.5} />
      <Rect x={23} y={23} width={4} height={4} fill={color} rx={0.5} />
    </Svg>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────
export function SummaryCard({
  driverName, driverNumber, co2Saved, mjHarvested, efficiency,
  teamColor = Colors.CYAN, teamName = 'MERCEDES', raceName = 'ABU DHABI GP',
}: SummaryCardProps) {
  const initials = driverName.split(' ').map(p => p[0]).join('');

  return (
    <ImageBackground
      source={require('../../assets/carbon_fiber.png')}
      style={styles.card}
      imageStyle={styles.cardBg}
    >
      {/* Dark overlay — lighter at top so card elements read clearly */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.80)', 'rgba(0,0,0,0.92)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Team color top accent bar */}
      <View style={[styles.topAccent, { backgroundColor: teamColor }]} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={[styles.redDot, { backgroundColor: Colors.SCUDERIA_RED }]} />
          <Text style={styles.logoText}>CARBONLAP</Text>
        </View>
        <Text style={styles.raceLabel}>{raceName}  ·  2026</Text>
      </View>

      {/* ── AWARD TITLE ── */}
      <View style={styles.awardBlock}>
        <Text style={styles.awardEmoji}>🏆</Text>
        <Text style={styles.awardLine1}>ECO-DRIVER</Text>
        <Text style={[styles.awardLine2, { color: teamColor }]}>OF THE DAY</Text>
      </View>

      {/* ── PORTRAIT ── */}
      <View style={styles.portraitSection}>
        {/* Outer glow ring */}
        <View style={[styles.glowRingOuter, { borderColor: teamColor + '50', shadowColor: teamColor }]} />
        {/* Inner filled circle */}
        <LinearGradient
          colors={[teamColor + '30', teamColor + '10', 'rgba(0,0,0,0.5)']}
          style={styles.portraitCircle}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
        >
          {/* Ghost race number */}
          <Text style={styles.ghostNumber}>{driverNumber}</Text>
          {/* Initials on top */}
          <Text style={[styles.initials, { color: teamColor }]}>{initials}</Text>
        </LinearGradient>

        {/* Corner brackets — positioned relative to portrait */}
        <View style={styles.bracketTL}>
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Path d="M1 13 L1 1 L13 1" stroke={teamColor} strokeWidth={1.5} fill="none" strokeOpacity={0.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
        <View style={styles.bracketTR}>
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Path d="M13 13 L13 1 L1 1" stroke={teamColor} strokeWidth={1.5} fill="none" strokeOpacity={0.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      </View>

      {/* ── NAMEPLATE ── */}
      <View style={styles.nameplate}>
        <View style={[styles.nameplateInner, { borderColor: teamColor + '50' }]}>
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
            style={styles.nameplateGrad}
          >
            <Text style={[styles.carNumber, { color: teamColor }]}>#{driverNumber}</Text>
            <Text style={styles.driverName}>{driverName}</Text>
            <Text style={[styles.teamName, { color: teamColor }]}>{teamName}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* ── STAT GAUGES ── */}
      <View style={[styles.gaugesRow, { borderColor: 'rgba(255,255,255,0.07)' }]}>
        <ArcGauge value={co2Saved} max={20} color={Colors.CYAN} label="CO₂ SAVED" unit="kg" gradId="g1" />
        <View style={[styles.gaugeDivider, { backgroundColor: teamColor }]} />
        <ArcGauge value={efficiency} max={100} color={Colors.GREEN} label="EFFICIENCY" unit="%" gradId="g2" />
        <View style={[styles.gaugeDivider, { backgroundColor: teamColor }]} />
        <ArcGauge value={mjHarvested} max={15} color="#FF8800" label="MJ HARVEST" unit="MJ" gradId="g3" />
      </View>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        {/* Verified */}
        <View style={styles.verifiedRow}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <View>
            <Text style={styles.verifiedText}>VERIFIED</Text>
            <Text style={styles.telemetryText}>TELEMETRY</Text>
          </View>
        </View>

        {/* Hashtags */}
        <Text style={styles.hashtags}>#CarbonLap{'\n'}#EcoF1 2026</Text>

        {/* QR deco */}
        <QrDeco color={teamColor} />
      </View>
    </ImageBackground>
  );
}

const PORTRAIT_SIZE = 120;
const RING_SIZE = PORTRAIT_SIZE + 20;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 20,
    overflow: 'hidden',
    // Use column layout with even gaps — NO space-between
    flexDirection: 'column',
    padding: 20,
    gap: 16,
  },
  cardBg: { borderRadius: 20 },

  // Top accent bar
  topAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 3,
    opacity: 0.85,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  redDot: {
    width: 8, height: 8, borderRadius: 4,
    shadowColor: Colors.SCUDERIA_RED, shadowOpacity: 1, shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  logoText: { fontSize: 12, fontWeight: '800', color: Colors.WHITE, letterSpacing: 3 },
  raceLabel: { fontSize: 9, color: Colors.LIGHT_GRAY, letterSpacing: 1.5, fontWeight: '500' },

  // Award title
  awardBlock: { alignItems: 'center', gap: 2 },
  awardEmoji: { fontSize: 20, lineHeight: 24 },
  awardLine1: { fontSize: 11, fontWeight: '700', color: Colors.LIGHT_GRAY, letterSpacing: 5 },
  awardLine2: { fontSize: 26, fontWeight: '900', letterSpacing: 5, lineHeight: 28 },

  // Portrait
  portraitSection: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: RING_SIZE,
  },
  glowRingOuter: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  portraitCircle: {
    width: PORTRAIT_SIZE,
    height: PORTRAIT_SIZE,
    borderRadius: PORTRAIT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  ghostNumber: {
    position: 'absolute',
    fontSize: 80,
    fontWeight: '900',
    color: Colors.WHITE,
    opacity: 0.06,
    lineHeight: 80,
    letterSpacing: -4,
  },
  initials: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 3,
    zIndex: 2,
  },
  bracketTL: { position: 'absolute', top: 4, left: '50%', marginLeft: -(PORTRAIT_SIZE / 2) - 10 },
  bracketTR: { position: 'absolute', top: 4, left: '50%', marginLeft: (PORTRAIT_SIZE / 2) - 4 },

  // Nameplate
  nameplate: { alignItems: 'center' },
  nameplateInner: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 180,
    alignSelf: 'center',
  },
  nameplateGrad: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    gap: 2,
  },
  carNumber: { fontSize: 10, fontWeight: '900', letterSpacing: 3 },
  driverName: { fontSize: 20, fontWeight: '900', color: Colors.WHITE, letterSpacing: 1.5 },
  teamName: { fontSize: 9, fontWeight: '700', letterSpacing: 3 },

  // Gauges
  gaugesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  gaugeDivider: { width: 1, height: 40, opacity: 0.2 },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkCircle: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.GREEN,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 10, color: Colors.GREEN, fontWeight: '900' },
  verifiedText: { fontSize: 8, color: Colors.GREEN, fontWeight: '800', letterSpacing: 2 },
  telemetryText: { fontSize: 7, color: Colors.GRAY, letterSpacing: 1.5 },
  hashtags: {
    fontSize: 8, color: 'rgba(255,255,255,0.22)',
    textAlign: 'center', letterSpacing: 0.5, lineHeight: 13,
  },
});

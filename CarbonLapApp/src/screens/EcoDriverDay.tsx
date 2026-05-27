import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import { SummaryCard } from '../components/SummaryCard';
import { Colors } from '../theme/colors';
import { DRIVERS, DriverData } from '../data/mockData';

// Try share lib
let Share: any = null;
try { Share = require('react-native-share').default; } catch {}

// ─── Driver Data ─────────────────────────────────────────────────────────────
const TEAM_COLORS: Record<string, string> = {
  MCLAREN: '#FF8000', FERRARI: '#FF2800', MERCEDES: '#00D2BE', 'RED BULL': '#0600EF',
};

const SORTED = [...DRIVERS].sort((a, b) => b.efficiency - a.efficiency);
const ECO_DRIVER = SORTED[0];
const P2 = SORTED[1];
const P3 = SORTED[2];

// ─── Achievement Badge ────────────────────────────────────────────────────────
interface BadgeProps { icon: string; label: string; value: string; color: string }
function AchievementBadge({ icon, label, value, color }: BadgeProps) {
  const scale = useRef(new Animated.Value(0.85)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }).start();
  }, []);
  return (
    <Animated.View style={[badgeStyles.wrap, { transform: [{ scale }] }]}>
      <LinearGradient
        colors={[color + '18', color + '06']}
        style={[badgeStyles.gradient, { borderColor: color + '40' }]}
      >
        <Text style={badgeStyles.icon}>{icon}</Text>
        <Text style={[badgeStyles.value, { color }]}>{value}</Text>
        <Text style={badgeStyles.label}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
}
const badgeStyles = StyleSheet.create({
  wrap: { flex: 1 },
  gradient: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 3,
  },
  icon: { fontSize: 22 },
  value: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  label: { fontSize: 8, color: Colors.GRAY, letterSpacing: 1.5, fontWeight: '600', textAlign: 'center' },
});

// ─── Mini Podium Card ─────────────────────────────────────────────────────────
interface PodiumProps { driver: DriverData; pos: number; isWinner?: boolean }
function PodiumCard({ driver, pos, isWinner }: PodiumProps) {
  const color = TEAM_COLORS[driver.team] ?? Colors.WHITE;
  const medals = ['', '🥇', '🥈', '🥉'];
  const firstName = driver.name.split('.')[1]?.trim() ?? driver.name;
  return (
    <View style={[
      podiumStyles.card,
      isWinner ? podiumStyles.cardWinner : podiumStyles.cardSide,
      { borderColor: color + '45' },
    ]}>
      {isWinner && (
        <LinearGradient
          colors={[color + '20', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      )}
      <Text style={[podiumStyles.medal, isWinner && podiumStyles.medalBig]}>{medals[pos]}</Text>
      <View style={[
        podiumStyles.avatar,
        isWinner && podiumStyles.avatarBig,
        { backgroundColor: color + '22', borderColor: color + '70' },
      ]}>
        <Text style={[
          podiumStyles.initials,
          isWinner && podiumStyles.initialsBig,
          { color },
        ]}>
          {driver.name.split(' ').map(p => p[0]).join('')}
        </Text>
      </View>
      <Text style={[podiumStyles.name, isWinner && podiumStyles.nameWinner]} numberOfLines={1}>
        {firstName}
      </Text>
      <Text style={[podiumStyles.team, { color }]}>{driver.team}</Text>
      <View style={[podiumStyles.effPill, { backgroundColor: color + '18', borderColor: color + '40' }]}>
        <Text style={[podiumStyles.eff, { color }]}>{driver.efficiency.toFixed(1)}%</Text>
      </View>
    </View>
  );
}
const podiumStyles = StyleSheet.create({
  // Shared base
  card: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: Colors.CARD_BG,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  // P1 — taller, more prominent
  cardWinner: {
    minHeight: 180,
    paddingTop: 14,
    zIndex: 2,
    // subtle elevation
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  // P2 / P3 — shorter
  cardSide: {
    minHeight: 144,
    paddingTop: 10,
    marginTop: 18, // pushes them down so P1 is higher
  },
  medal: { fontSize: 18, marginBottom: 2 },
  medalBig: { fontSize: 24, marginBottom: 4 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  avatarBig: { width: 52, height: 52, borderRadius: 26 },
  initials: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  initialsBig: { fontSize: 17 },
  name: { fontSize: 9, fontWeight: '800', color: Colors.WHITE, letterSpacing: 0.3, textAlign: 'center' },
  nameWinner: { fontSize: 11, fontWeight: '900' },
  team: { fontSize: 7, fontWeight: '700', letterSpacing: 1, textAlign: 'center', marginBottom: 4 },
  effPill: {
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 2, marginTop: 2,
  },
  eff: { fontSize: 12, fontWeight: '900' },
});

// ─── Floating Glow Dots (ambient decoration) ──────────────────────────────────
function GlowDots() {
  const DOT_COUNT = 8;
  const anims = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const DOT_POSITIONS = [
    { top: 8, left: '10%' }, { top: 20, left: '75%' },
    { top: 5, left: '45%' }, { top: 18, left: '88%' },
    { top: 12, left: '30%' }, { top: 3, left: '60%' },
    { top: 22, left: '18%' }, { top: 10, left: '92%' },
  ];
  const DOT_COLORS = [Colors.CYAN, Colors.GREEN, Colors.CYAN, '#FF8800', Colors.GREEN, Colors.CYAN, '#FF8800', Colors.GREEN];

  return (
    <View style={dotStyles.container} pointerEvents="none">
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            dotStyles.dot,
            DOT_POSITIONS[i],
            { backgroundColor: DOT_COLORS[i], opacity: anim, shadowColor: DOT_COLORS[i] },
          ]}
        />
      ))}
    </View>
  );
}
const dotStyles = StyleSheet.create({
  container: { height: 30, position: 'relative', overflow: 'visible' },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function EcoDriverDayScreen() {
  const captureRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const shareScale = useRef(new Animated.Value(1)).current;

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);

    // Button press animation
    Animated.sequence([
      Animated.timing(shareScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(shareScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    try {
      const uri = await (captureRef.current as any)?.capture?.();
      if (!uri) throw new Error('Capture failed');
      setCaptured(true);

      if (Share) {
        await Share.open({
          url: `data:image/png;base64,${uri}`,
          title: 'Eco Driver of the Day — CarbonLap',
          message: `🏆 ${ECO_DRIVER.name} is today's Eco-Driver! ${ECO_DRIVER.efficiency.toFixed(1)}% efficiency — CarbonLap 2026 #F1`,
          type: 'image/png',
        });
      } else {
        Alert.alert('📸 Card Captured!', 'Share requires a dev build on device. The card snapshot is ready.', [{ text: 'Awesome!' }]);
      }
    } catch (e: any) {
      if (e?.message !== 'User did not share') {
        Alert.alert('Ready to Share', 'Build with EAS to unlock the native share sheet.');
      }
    } finally {
      setSharing(false);
    }
  };

  const teamColor = TEAM_COLORS[ECO_DRIVER.team] ?? Colors.CYAN;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── PAGE HEADER ── */}
        <View style={styles.pageHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerSub}>POST-RACE AWARD</Text>
            <Text style={styles.headerTitle}>ECO-DRIVER{'\n'}OF THE DAY</Text>
          </View>
          <View style={[styles.trophyBubble, { backgroundColor: teamColor + '18', borderColor: teamColor + '40' }]}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={[styles.trophyLabel, { color: teamColor }]}>2026</Text>
          </View>
        </View>

        {/* Ambient floating dots */}
        <GlowDots />

        {/* ── PODIUM ROW ── */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionLine, { backgroundColor: teamColor }]} />
          <Text style={styles.sectionLabel}>FINAL PODIUM</Text>
          <View style={[styles.sectionLine, { backgroundColor: teamColor }]} />
        </View>
        {/* alignItems flex-end aligns card bottoms, marginTop on side cards creates the step */}
        <View style={styles.podiumRow}>
          <PodiumCard driver={P2} pos={2} />
          <PodiumCard driver={ECO_DRIVER} pos={1} isWinner />
          <PodiumCard driver={P3} pos={3} />
        </View>

        {/* ── ACHIEVEMENT BADGES ── */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionLine, { backgroundColor: teamColor }]} />
          <Text style={styles.sectionLabel}>RACE HIGHLIGHTS</Text>
          <View style={[styles.sectionLine, { backgroundColor: teamColor }]} />
        </View>
        <View style={styles.badgesRow}>
          <AchievementBadge
            icon="🌿"
            label="CO₂ SAVED"
            value={`${(ECO_DRIVER.co2Total * 0.17).toFixed(1)}kg`}
            color={Colors.CYAN}
          />
          <AchievementBadge
            icon="⚡"
            label="MJ HARVESTED"
            value={`${(ECO_DRIVER.mguKPower * 0.12).toFixed(1)}MJ`}
            color="#FF8800"
          />
          <AchievementBadge
            icon="📈"
            label="EFFICIENCY"
            value={`${ECO_DRIVER.efficiency.toFixed(1)}%`}
            color={Colors.GREEN}
          />
        </View>

        {/* ── EXPORT CARD ── */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionLine, { backgroundColor: teamColor }]} />
          <Text style={styles.sectionLabel}>SHAREABLE CARD</Text>
          <View style={[styles.sectionLine, { backgroundColor: teamColor }]} />
        </View>

        {/* Glow halo behind the card */}
        <View style={[styles.cardHalo, { shadowColor: teamColor }]}>
          <ViewShot
            ref={captureRef}
            options={{ format: 'png', quality: 1, result: 'base64' }}
            style={styles.viewShot}
          >
            <SummaryCard
              driverName={ECO_DRIVER.name}
              driverNumber={ECO_DRIVER.number}
              co2Saved={ECO_DRIVER.co2Total * 0.17}
              mjHarvested={ECO_DRIVER.mguKPower * 0.12}
              efficiency={ECO_DRIVER.efficiency}
              teamColor={teamColor}
              teamName={ECO_DRIVER.team}
              raceName="ABU DHABI GP"
            />
          </ViewShot>
        </View>

        {/* Capture success badge */}
        {captured && (
          <View style={styles.capturedBadge}>
            <Text style={styles.capturedText}>✓  CARD READY TO SHARE</Text>
          </View>
        )}

        {/* Hint */}
        <Text style={styles.hint}>
          Tap below to post to Instagram, WhatsApp, X and more →
        </Text>

        {/* Spacer for fixed button */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── FIXED SHARE BUTTON ── */}
      <View style={styles.shareWrapper}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
          style={styles.fadeOverlay}
          pointerEvents="none"
        />
        <Animated.View style={{ transform: [{ scale: shareScale }] }}>
          <Pressable onPress={handleShare} disabled={sharing}>
            <LinearGradient
              colors={sharing ? ['#333', '#222'] : [teamColor, shadeColor(teamColor, -30)]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shareGradient}
            >
              {/* Left icon cluster */}
              <View style={styles.shareIcons}>
                <Text style={styles.shareIconText}>📸</Text>
              </View>

              <View style={styles.shareLabelBlock}>
                <Text style={styles.shareLabelMain}>
                  {sharing ? 'CAPTURING...' : 'SHARE TO STORY'}
                </Text>
                <Text style={styles.shareLabelSub}>
                  {sharing ? 'please wait' : 'Instagram · WhatsApp · X'}
                </Text>
              </View>

              <Text style={styles.shareArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// Darken a hex color by amount
function shadeColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.OLED_BLACK },
  scroll: { flex: 1 },
  content: { gap: 16, paddingBottom: 20, paddingHorizontal: 16 },

  // Page header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingHorizontal: 4,
  },
  headerLeft: { gap: 3 },
  headerSub: {
    fontSize: 9,
    color: Colors.GRAY,
    letterSpacing: 4,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.WHITE,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  trophyBubble: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  trophyEmoji: { fontSize: 26 },
  trophyLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 2 },

  // Section dividers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: -4,
  },
  sectionLine: { flex: 1, height: 1, opacity: 0.3 },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.GRAY,
    letterSpacing: 3,
  },

  // Podium
  podiumRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-end' },

  // Badges
  badgesRow: { flexDirection: 'row', gap: 8 },

  // Card
  cardHalo: {
    borderRadius: 22,
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  viewShot: { borderRadius: 20, overflow: 'hidden' },

  capturedBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.25)',
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  capturedText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.GREEN,
    letterSpacing: 2,
  },
  hint: {
    fontSize: 11,
    color: Colors.GRAY,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Fixed share button
  shareWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  fadeOverlay: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 40,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
  },
  shareIcons: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIconText: { fontSize: 18 },
  shareLabelBlock: { flex: 1, gap: 1 },
  shareLabelMain: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.WHITE,
    letterSpacing: 2,
  },
  shareLabelSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
  },
  shareArrow: {
    fontSize: 20,
    color: Colors.WHITE,
    fontWeight: '900',
    opacity: 0.8,
  },
});

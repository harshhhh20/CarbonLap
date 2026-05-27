import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { CALENDAR_2026, Race, NEXT_RACE, TOTAL_ROUNDS } from '../data/calendar2026';

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
type Filter = 'ALL' | 'SPRINT' | 'UPCOMING';
const FILTERS: Filter[] = ['ALL', 'UPCOMING', 'SPRINT'];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  completed: { label: 'DONE',      color: '#555555', bg: 'rgba(85,85,85,0.12)' },
  next:      { label: 'NEXT RACE', color: '#00FFFF', bg: 'rgba(0,255,255,0.10)' },
  upcoming:  { label: 'UPCOMING',  color: '#00FF88', bg: 'rgba(0,255,136,0.08)' },
  cancelled: { label: 'CANCELLED', color: '#FF2800', bg: 'rgba(255,40,0,0.10)' },
};

// ─── Race Card ────────────────────────────────────────────────────────────────
function RaceCard({ race, isHighlighted }: { race: Race; isHighlighted: boolean }) {
  const cfg = STATUS_CONFIG[race.status];
  const dimmed = race.status === 'completed' || race.status === 'cancelled';

  return (
    <View style={[
      styles.card,
      isHighlighted && styles.cardNext,
      dimmed && styles.cardDimmed,
    ]}>
      {isHighlighted && (
        <LinearGradient
          colors={['rgba(0,255,255,0.06)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
      )}

      {/* Round badge + flags */}
      <View style={styles.cardLeft}>
        <View style={[styles.roundBadge, isHighlighted && styles.roundBadgeNext]}>
          <Text style={[styles.roundText, isHighlighted && { color: Colors.CYAN }]}>
            R{race.round.toString().padStart(2, '0')}
          </Text>
        </View>
        <Text style={styles.cardFlag}>{race.flag}</Text>
      </View>

      {/* Race info */}
      <View style={styles.cardMid}>
        <View style={styles.cardTitleRow}>
          <Text style={[styles.cardName, dimmed && styles.textDimmed]} numberOfLines={1}>
            {race.shortName} GRAND PRIX
          </Text>
          {race.isSprint && (
            <View style={styles.sprintBadge}>
              <Text style={styles.sprintText}>SPRINT</Text>
            </View>
          )}
          {race.status === 'cancelled' && (
            <View style={styles.cancelBadge}>
              <Text style={styles.cancelText}>✕</Text>
            </View>
          )}
        </View>
        <Text style={[styles.cardCircuit, dimmed && styles.textDimmed]} numberOfLines={1}>
          {race.circuit}
        </Text>
        <Text style={styles.cardDate}>{race.dates}</Text>
      </View>

      {/* Status pill */}
      <View style={[styles.statusPill, { backgroundColor: cfg.bg, borderColor: cfg.color + '40' }]}>
        <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function CalendarScreen() {
  const [filter, setFilter] = useState<Filter>('ALL');

  const filtered = CALENDAR_2026.filter((r) => {
    if (filter === 'SPRINT')   return r.isSprint && r.status !== 'cancelled';
    if (filter === 'UPCOMING') return r.status === 'upcoming' || r.status === 'next';
    return true;
  });

  const completed  = CALENDAR_2026.filter((r) => r.status === 'completed').length;
  const cancelled  = CALENDAR_2026.filter((r) => r.status === 'cancelled').length;
  const sprintCount = CALENDAR_2026.filter((r) => r.isSprint && r.status !== 'cancelled').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSup}>FIA FORMULA ONE WORLD CHAMPIONSHIP</Text>
            <Text style={styles.headerTitle}>2026 SEASON{'\n'}CALENDAR</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{TOTAL_ROUNDS}</Text>
              <Text style={styles.statLabel}>ROUNDS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: Colors.CYAN }]}>{sprintCount}</Text>
              <Text style={styles.statLabel}>SPRINTS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: Colors.GREEN }]}>{completed}</Text>
              <Text style={styles.statLabel}>DONE</Text>
            </View>
          </View>
        </View>

        {/* ── NEXT RACE HERO ── */}
        <View style={styles.nextHero}>
          <LinearGradient
            colors={['rgba(0,255,255,0.08)', 'rgba(0,255,255,0.02)']}
            style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
          />
          <View style={styles.nextHeroTop}>
            <View style={styles.nextLiveDot} />
            <Text style={styles.nextHeroLabel}>NEXT RACE</Text>
          </View>
          <Text style={styles.nextHeroFlag}>{NEXT_RACE.flag}</Text>
          <Text style={styles.nextHeroName}>{NEXT_RACE.name.toUpperCase()}</Text>
          <Text style={styles.nextHeroCircuit}>{NEXT_RACE.circuit}</Text>
          <View style={styles.nextHeroMeta}>
            <Text style={styles.nextHeroDate}>📅  {NEXT_RACE.dates}</Text>
            <Text style={styles.nextHeroLoc}>📍  {NEXT_RACE.location}, {NEXT_RACE.country}</Text>
            {NEXT_RACE.isSprint && (
              <View style={[styles.sprintBadge, { alignSelf: 'flex-start', marginTop: 4 }]}>
                <Text style={styles.sprintText}>⚡ SPRINT WEEKEND</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── FILTER TABS ── */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
            >
              {filter === f && (
                <LinearGradient
                  colors={['rgba(0,255,255,0.15)', 'rgba(0,255,255,0.04)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                />
              )}
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── RACE LIST ── */}
        <View style={styles.raceList}>
          {filtered.map((race) => (
            <RaceCard
              key={race.round}
              race={race}
              isHighlighted={race.status === 'next'}
            />
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.OLED_BLACK },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 20, gap: 16 },

  // Header
  header: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerSup: {
    fontSize: 7, color: Colors.GRAY, letterSpacing: 2, fontWeight: '600', marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28, fontWeight: '900', color: Colors.WHITE, lineHeight: 30, letterSpacing: 0.5,
  },
  headerStats: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  statBox:     { alignItems: 'center', gap: 2 },
  statNum:     { fontSize: 22, fontWeight: '900', color: Colors.WHITE },
  statLabel:   { fontSize: 7, color: Colors.GRAY, fontWeight: '700', letterSpacing: 1.5 },

  // Next Race Hero
  nextHero: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.20)',
    padding: 18,
    gap: 4,
    overflow: 'hidden',
  },
  nextHeroTop:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  nextLiveDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.CYAN },
  nextHeroLabel:  { fontSize: 9, color: Colors.CYAN, fontWeight: '800', letterSpacing: 3 },
  nextHeroFlag:   { fontSize: 40 },
  nextHeroName:   { fontSize: 22, fontWeight: '900', color: Colors.WHITE, letterSpacing: 0.5, marginTop: 2 },
  nextHeroCircuit: { fontSize: 12, color: Colors.GRAY, fontWeight: '500', letterSpacing: 0.3 },
  nextHeroMeta:   { gap: 4, marginTop: 8 },
  nextHeroDate:   { fontSize: 12, color: Colors.LIGHT_GRAY, fontWeight: '600' },
  nextHeroLoc:    { fontSize: 12, color: Colors.LIGHT_GRAY, fontWeight: '600' },

  // Filter tabs
  filterRow: { flexDirection: 'row', gap: 8 },
  filterTab: {
    flex: 1, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.GLASS_BORDER,
    alignItems: 'center', overflow: 'hidden',
  },
  filterTabActive: { borderColor: 'rgba(0,255,255,0.40)' },
  filterText:      { fontSize: 10, fontWeight: '700', color: Colors.GRAY, letterSpacing: 1.5 },
  filterTextActive: { color: Colors.CYAN },

  // Race list
  raceList: { gap: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.GLASS_BORDER,
    padding: 12,
    overflow: 'hidden',
  },
  cardNext:   { borderColor: 'rgba(0,255,255,0.25)' },
  cardDimmed: { opacity: 0.5 },

  cardLeft: { alignItems: 'center', gap: 4, width: 42 },
  roundBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2,
  },
  roundBadgeNext: { backgroundColor: 'rgba(0,255,255,0.12)' },
  roundText:   { fontSize: 9, fontWeight: '800', color: Colors.GRAY, letterSpacing: 1 },
  cardFlag:    { fontSize: 22 },

  cardMid:      { flex: 1, gap: 2 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  cardName:     { fontSize: 12, fontWeight: '800', color: Colors.WHITE, letterSpacing: 0.3 },
  cardCircuit:  { fontSize: 10, color: Colors.GRAY, fontWeight: '500' },
  cardDate:     { fontSize: 10, color: Colors.LIGHT_GRAY, fontWeight: '600', marginTop: 1 },
  textDimmed:   { color: Colors.GRAY },

  sprintBadge: {
    backgroundColor: 'rgba(255,215,0,0.12)', borderRadius: 5,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.30)',
    paddingHorizontal: 5, paddingVertical: 1,
  },
  sprintText:  { fontSize: 7, fontWeight: '800', color: '#FFD700', letterSpacing: 1 },
  cancelBadge: {
    backgroundColor: 'rgba(255,40,0,0.12)', borderRadius: 5,
    borderWidth: 1, borderColor: 'rgba(255,40,0,0.30)',
    paddingHorizontal: 5, paddingVertical: 1,
  },
  cancelText:  { fontSize: 8, fontWeight: '800', color: Colors.SCUDERIA_RED },

  statusPill: {
    borderRadius: 8, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3, alignItems: 'center',
  },
  statusText:  { fontSize: 7, fontWeight: '800', letterSpacing: 1 },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { TEAMS_2026, Team, Driver } from '../data/teams2026';

// ─── Rookie Crown ─────────────────────────────────────────────────────────────
function RookieBadge() {
  return (
    <View style={driverStyles.rookieBadge}>
      <Text style={driverStyles.rookieText}>ROOKIE</Text>
    </View>
  );
}

// ─── Driver Row ───────────────────────────────────────────────────────────────
function DriverRow({ driver, teamColor }: { driver: Driver; teamColor: string }) {
  return (
    <View style={driverStyles.row}>
      {/* Number */}
      <View style={[driverStyles.numBox, { borderColor: teamColor + '50', backgroundColor: teamColor + '10' }]}>
        <Text style={[driverStyles.num, { color: teamColor }]}>#{driver.number}</Text>
      </View>

      {/* Avatar initials */}
      <View style={[driverStyles.avatar, { backgroundColor: teamColor + '18', borderColor: teamColor + '40' }]}>
        <Text style={[driverStyles.initials, { color: teamColor }]}>
          {driver.firstName[0]}{driver.lastName[0]}
        </Text>
      </View>

      {/* Name block */}
      <View style={driverStyles.nameBlock}>
        <View style={driverStyles.nameRow}>
          <Text style={driverStyles.lastName}>{driver.lastName.toUpperCase()}</Text>
          {driver.isRookie && <RookieBadge />}
        </View>
        <Text style={driverStyles.firstName}>{driver.firstName}  {driver.flag}</Text>
      </View>

      {/* Code */}
      <Text style={[driverStyles.code, { color: teamColor }]}>{driver.code}</Text>
    </View>
  );
}

const driverStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  numBox: {
    width: 40, borderRadius: 7, borderWidth: 1,
    alignItems: 'center', paddingVertical: 2,
  },
  num:     { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  initials:  { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  nameBlock: { flex: 1, gap: 1 },
  nameRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lastName:  { fontSize: 13, fontWeight: '900', color: Colors.WHITE, letterSpacing: 0.5 },
  firstName: { fontSize: 10, color: Colors.GRAY, fontWeight: '500' },
  code: { fontSize: 14, fontWeight: '900', letterSpacing: 1 },

  rookieBadge: {
    backgroundColor: 'rgba(255,215,0,0.12)', borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)',
    paddingHorizontal: 4, paddingVertical: 1,
  },
  rookieText: { fontSize: 6.5, fontWeight: '800', color: '#FFD700', letterSpacing: 1 },
});

// ─── Team Card ────────────────────────────────────────────────────────────────
function TeamCard({ team }: { team: Team }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={[teamStyles.card, { borderColor: team.color + '30' }]}>
      {/* Subtle color flush */}
      <LinearGradient
        colors={[team.color + '08', 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
      />

      {/* Team header */}
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={[teamStyles.header, { borderBottomColor: team.color + '25' }]}
      >
        {/* Color stripe */}
        <View style={[teamStyles.stripe, { backgroundColor: team.color }]} />

        <View style={teamStyles.headerInfo}>
          <View style={teamStyles.headerNameRow}>
            <Text style={teamStyles.teamName}>{team.name.toUpperCase()}</Text>
            {team.isNew && (
              <View style={teamStyles.newBadge}>
                <Text style={teamStyles.newText}>NEW</Text>
              </View>
            )}
          </View>
          <Text style={teamStyles.engineText}>
            {team.shortName}  ·  {team.engine} Power Unit
          </Text>
        </View>

        {/* Driver count pill */}
        <View style={[teamStyles.driverCount, { backgroundColor: team.color + '15', borderColor: team.color + '35' }]}>
          <Text style={[teamStyles.driverCountText, { color: team.color }]}>
            {team.drivers.filter((d) => d.isRookie).length > 0
              ? `${team.drivers.filter((d) => d.isRookie).length} 🌟`
              : '2 ✓'}
          </Text>
        </View>

        <Text style={[teamStyles.chevron, { color: team.color }]}>
          {expanded ? '▲' : '▼'}
        </Text>
      </Pressable>

      {/* Driver rows */}
      {expanded && team.drivers.map((d) => (
        <DriverRow key={d.code} driver={d} teamColor={team.color} />
      ))}
    </View>
  );
}

const teamStyles = StyleSheet.create({
  card: {
    borderRadius: 16, borderWidth: 1,
    backgroundColor: Colors.CARD_BG, overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 10,
    borderBottomWidth: 1,
  },
  stripe: { width: 3, height: 36, borderRadius: 2 },
  headerInfo:   { flex: 1, gap: 2 },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  teamName:     { fontSize: 14, fontWeight: '900', color: Colors.WHITE, letterSpacing: 0.5 },
  engineText:   { fontSize: 9, color: Colors.GRAY, fontWeight: '600', letterSpacing: 0.5 },
  driverCount:  {
    borderRadius: 8, borderWidth: 1,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  driverCountText: { fontSize: 10, fontWeight: '800' },
  chevron: { fontSize: 10, fontWeight: '700' },

  newBadge: {
    backgroundColor: 'rgba(0,255,136,0.12)', borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(0,255,136,0.35)',
    paddingHorizontal: 5, paddingVertical: 1,
  },
  newText: { fontSize: 7, fontWeight: '900', color: Colors.GREEN, letterSpacing: 1.5 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function TeamsScreen() {
  const rookieCount = TEAMS_2026.flatMap((t) => t.drivers).filter((d) => d.isRookie).length;
  const newTeams    = TEAMS_2026.filter((t) => t.isNew).length;

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
            <Text style={styles.headerTitle}>2026 GRID{'\n'}LINEUPS</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{TEAMS_2026.length}</Text>
              <Text style={styles.statLabel}>TEAMS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#FFD700' }]}>{rookieCount}</Text>
              <Text style={styles.statLabel}>ROOKIES</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: Colors.GREEN }]}>{newTeams}</Text>
              <Text style={styles.statLabel}>NEW</Text>
            </View>
          </View>
        </View>

        {/* ── SEASON NOTE BANNER ── */}
        <View style={styles.noteBanner}>
          <Text style={styles.noteIcon}>⚡</Text>
          <Text style={styles.noteText}>
            2026 introduces the new hybrid power unit regulation. All-new constructors
            Audi and Cadillac join the grid.
          </Text>
        </View>

        {/* ── LEGEND ── */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFD700' }]} />
            <Text style={styles.legendText}>Rookie</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.GREEN }]} />
            <Text style={styles.legendText}>New team</Text>
          </View>
        </View>

        {/* ── TEAM CARDS ── */}
        {TEAMS_2026.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.OLED_BLACK },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 20, gap: 14 },

  header: {
    paddingTop: 20, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'flex-end',
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

  noteBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: 'rgba(0,255,255,0.05)',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.15)',
    padding: 12,
  },
  noteIcon: { fontSize: 16, marginTop: 1 },
  noteText: { flex: 1, fontSize: 11, color: Colors.LIGHT_GRAY, lineHeight: 17 },

  legend: { flexDirection: 'row', gap: 16, paddingHorizontal: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:  { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 10, color: Colors.GRAY, fontWeight: '600' },
});

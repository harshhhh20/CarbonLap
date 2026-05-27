import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { DriverRankCard } from '../components/DriverRankCard';
import { Colors } from '../theme/colors';
import { LEADERBOARD_DATA, DriverData } from '../data/mockData';

function TabBar({ active, onSwitch }: { active: 'DRIVERS' | 'CONSTRUCTORS'; onSwitch: (t: 'DRIVERS' | 'CONSTRUCTORS') => void }) {
  return (
    <View style={styles.tabBar}>
      {(['DRIVERS', 'CONSTRUCTORS'] as const).map((tab) => (
        <View key={tab} style={styles.tabItem}>
          <Text
            onPress={() => onSwitch(tab)}
            style={[styles.tabLabel, active === tab && styles.tabActive]}
          >
            {tab}
          </Text>
          {active === tab && <View style={styles.tabIndicator} />}
        </View>
      ))}
    </View>
  );
}

export function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');
  const [standings, setStandings] = useState<DriverData[]>(LEADERBOARD_DATA);

  // Auto-sort every 3 seconds with slight random drift
  useEffect(() => {
    const id = setInterval(() => {
      setStandings((prev) =>
        [...prev]
          .map((d) => ({
            ...d,
            efficiency: Math.min(100, Math.max(80, d.efficiency + (Math.random() - 0.5) * 0.4)),
            trend: [...d.trend.slice(1), d.efficiency],
          }))
          .sort((a, b) => b.efficiency - a.efficiency)
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Constructor rollup
  const constructors = Object.values(
    standings.reduce<Record<string, { team: string; avgEff: number; count: number; color: string }>>((acc, d) => {
      const TEAM_COLORS: Record<string, string> = {
        MCLAREN: '#FF8000', FERRARI: '#FF2800', MERCEDES: '#00D2BE', 'RED BULL': '#0600EF',
      };
      if (!acc[d.team]) acc[d.team] = { team: d.team, avgEff: 0, count: 0, color: TEAM_COLORS[d.team] ?? Colors.WHITE };
      acc[d.team].avgEff += d.efficiency;
      acc[d.team].count += 1;
      return acc;
    }, {})
  ).map((c) => ({ ...c, avgEff: c.avgEff / c.count })).sort((a, b) => b.avgEff - a.avgEff);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>ECO-CHAMPIONSHIP</Text>
        <Text style={styles.headerTitle}>STANDINGS</Text>
        <View style={styles.liveChip}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE SORT</Text>
        </View>
      </View>

      <TabBar active={activeTab} onSwitch={setActiveTab} />

      {activeTab === 'DRIVERS' ? (
        <FlashList
          data={standings}
          keyExtractor={(item) => item.id}
          estimatedItemSize={90}
          renderItem={({ item, index }) => (
            <DriverRankCard driver={item} rank={index + 1} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlashList
          data={constructors}
          keyExtractor={(item) => item.team}
          estimatedItemSize={70}
          renderItem={({ item, index }) => (
            <View style={[styles.conRow, { borderColor: item.color + '30' }]}>
              <Text style={styles.conRank}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={[styles.conColor, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.conName}>{item.team}</Text>
                <Text style={[styles.conEff, { color: item.color }]}>
                  AVG {item.avgEff.toFixed(1)}% EFFICIENCY
                </Text>
              </View>
              <Text style={[styles.conScore, { color: item.color }]}>
                {(item.avgEff * 10).toFixed(0)} pts
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.OLED_BLACK,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 2,
  },
  headerSub: {
    fontSize: 10,
    color: Colors.GRAY,
    letterSpacing: 4,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.WHITE,
    letterSpacing: 2,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.GREEN,
    shadowColor: Colors.GREEN,
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  liveText: {
    fontSize: 10,
    color: Colors.GREEN,
    fontWeight: '700',
    letterSpacing: 2,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: 8,
  },
  tabItem: {
    marginRight: 24,
    paddingBottom: 10,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.GRAY,
    letterSpacing: 2,
  },
  tabActive: {
    color: Colors.WHITE,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.CYAN,
    shadowColor: Colors.CYAN,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  conRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 16,
    backgroundColor: Colors.CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
  },
  conRank: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.GRAY,
    width: 28,
  },
  conColor: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  conName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.WHITE,
    letterSpacing: 0.5,
  },
  conEff: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
  },
  conScore: {
    fontSize: 18,
    fontWeight: '900',
  },
});

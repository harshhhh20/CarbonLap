import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkline } from './Sparkline';
import { Colors } from '../theme/colors';
import { DriverData } from '../data/mockData';

const TEAM_COLORS: Record<string, string> = {
  MCLAREN: '#FF8000',
  FERRARI: '#FF2800',
  MERCEDES: '#00D2BE',
  'RED BULL': '#0600EF',
};

interface DriverRankCardProps {
  driver: DriverData;
  rank: number;
}

export function DriverRankCard({ driver, rank }: DriverRankCardProps) {
  const teamColor = TEAM_COLORS[driver.team] ?? Colors.CYAN;
  const effAnim = useRef(new Animated.Value(driver.efficiency)).current;

  useEffect(() => {
    Animated.timing(effAnim, {
      toValue: driver.efficiency,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [driver.efficiency]);

  const widthInterp = effAnim.interpolate({
    inputRange: [80, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <BlurView intensity={15} tint="dark" style={styles.blur}>
      <View style={[styles.container, { borderColor: teamColor + '30' }]}>

        {/* Ghost rank number */}
        <Text style={styles.ghostRank}>#{rank}</Text>

        {/* Left: rank badge */}
        <View style={[styles.rankBadge, { backgroundColor: teamColor + '20', borderColor: teamColor + '50' }]}>
          <Text style={[styles.rankText, { color: teamColor }]}>{String(rank).padStart(2, '0')}</Text>
        </View>

        {/* Center: driver info */}
        <View style={styles.info}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={[styles.teamName, { color: teamColor }]}>{driver.team}</Text>
          <View style={styles.effRow}>
            <View style={styles.effTrack}>
              <Animated.View
                style={[styles.effBar, { width: widthInterp, backgroundColor: teamColor }]}
              />
            </View>
            <Text style={[styles.effValue, { color: teamColor }]}>
              {driver.efficiency.toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Right: sparkline */}
        <View style={styles.right}>
          <Text style={styles.trendLabel}>TREND</Text>
          <Sparkline data={driver.trend} color={teamColor} width={64} height={22} />
          <Text style={styles.co2Label}>
            <Text style={styles.co2Value}>{driver.co2Total.toFixed(1)}</Text>
            {' '}kg CO₂
          </Text>
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  ghostRank: {
    position: 'absolute',
    right: 8,
    top: -4,
    fontSize: 80,
    fontWeight: '900',
    color: Colors.WHITE,
    opacity: 0.04,
    lineHeight: 80,
  },
  rankBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.WHITE,
    letterSpacing: 0.5,
  },
  teamName: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  effRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  effTrack: {
    flex: 1,
    height: 3,
    backgroundColor: '#1C1C1C',
    borderRadius: 2,
    overflow: 'hidden',
  },
  effBar: {
    height: '100%',
    borderRadius: 2,
  },
  effValue: {
    fontSize: 11,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  trendLabel: {
    fontSize: 8,
    color: Colors.GRAY,
    letterSpacing: 2,
    fontWeight: '600',
  },
  co2Label: {
    fontSize: 9,
    color: Colors.LIGHT_GRAY,
  },
  co2Value: {
    fontSize: 10,
    color: Colors.WHITE,
    fontWeight: '700',
  },
});

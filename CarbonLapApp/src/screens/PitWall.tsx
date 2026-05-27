import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/TopBar';
import { LiveRadialGauge } from '../components/LiveRadialGauge';
import { PowerUnitSplit } from '../components/PowerUnitSplit';
import { DriverCarousel } from '../components/DriverCarousel';
import { Colors } from '../theme/colors';
import { useLiveData } from '../hooks/useLiveData';
import { DRIVERS } from '../data/mockData';

const STAT_CARDS = [
  { label: 'TYRE LIFE', icon: '◉' },
  { label: 'TRACK TEMP', icon: '🌡' },
  { label: 'ERS STATE', icon: '⚡' },
  { label: 'WIND SPD', icon: '≋' },
];

export function PitWallScreen() {
  const [selectedDriverId, setSelectedDriverId] = useState<string>(DRIVERS[0].id);
  const liveData = useLiveData(selectedDriverId);

  // Derive stats from live data
  const tyreLife = 12;
  const trackTemp = 42.8;
  const ersState = Math.round(liveData.mguKPower * 0.9);
  const windSpeed = 4.2;

  const statValues = [
    { value: `${tyreLife} Laps`, sub: 'MEDIUM COMPOUND', subColor: Colors.YELLOW },
    { value: `${trackTemp.toFixed(1)}°C`, sub: '▲ 1.2° FROM START', subColor: Colors.SCUDERIA_RED },
    { value: `${ersState}%`, sub: ersState > 70 ? 'OVERTAKE READY' : 'CHARGING', subColor: Colors.CYAN },
    { value: `${windSpeed} m/s`, sub: 'HEADWIND T3', subColor: Colors.LIGHT_GRAY },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar isRaceLive={true} lap={34} totalLaps={58} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Circuit label */}
        <View style={styles.circuitRow}>
          <Text style={styles.circuitLabel}>ALBERT PARK CIRCUIT</Text>
          <View style={styles.lapPill}>
            <Text style={styles.lapText}>LAP 34/58</Text>
          </View>
        </View>

        {/* Driver selector */}
        <DriverCarousel
          drivers={DRIVERS}
          selectedId={selectedDriverId}
          onSelect={setSelectedDriverId}
        />

        {/* Radial gauge */}
        <View style={styles.gaugeWrapper}>
          <LiveRadialGauge value={liveData.co2Emission} maxValue={3} />
        </View>

        {/* Power split bars */}
        <PowerUnitSplit
          mguKPercent={liveData.mguKPower}
          icePercent={liveData.icePower}
          mguKValue={liveData.mguKPower * 0.6}
          iceValue={liveData.icePower * 1.3}
        />

        {/* Stat grid */}
        <View style={styles.grid}>
          {STAT_CARDS.map((card, i) => (
            <View key={card.label} style={styles.gridCard}>
              <Text style={styles.gcIcon}>{card.icon}</Text>
              <Text style={styles.gcLabel}>{card.label}</Text>
              <Text style={styles.gcValue}>{statValues[i].value}</Text>
              <Text style={[styles.gcSub, { color: statValues[i].subColor }]}>
                {statValues[i].sub}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.OLED_BLACK,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: 24,
    paddingBottom: 30,
  },
  circuitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  circuitLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.WHITE,
    letterSpacing: 2,
  },
  lapPill: {
    backgroundColor: Colors.GLASS,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GLASS_BORDER,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lapText: {
    fontSize: 11,
    color: Colors.LIGHT_GRAY,
    fontWeight: '600',
    letterSpacing: 1,
  },
  gaugeWrapper: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  gridCard: {
    width: '47%',
    backgroundColor: Colors.CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.GLASS_BORDER,
    padding: 14,
    gap: 4,
  },
  gcIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  gcLabel: {
    fontSize: 9,
    color: Colors.GRAY,
    letterSpacing: 2,
    fontWeight: '700',
  },
  gcValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.WHITE,
  },
  gcSub: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompoundSelector } from '../components/CompoundSelector';
import { CountdownBar } from '../components/CountdownBar';
import { Colors } from '../theme/colors';

export function StrategyPredictorScreen() {
  const [windowClosed, setWindowClosed] = useState(false);
  const [selectedCompound, setSelectedCompound] = useState<string | null>(null);
  const [timerStarted, setTimerStarted] = useState(true);

  const handleSelect = (compound: string) => {
    setSelectedCompound(compound);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>ECO-STRATEGY PREDICTOR</Text>
          <Text style={styles.headerTitle}>STRATEGY{'\n'}CALL</Text>
          <View style={styles.lapBadge}>
            <Text style={styles.lapBadgeText}>LAP 45</Text>
          </View>
        </View>

        {/* Context prompt */}
        <View style={styles.contextBlock}>
          <View style={styles.contextLine} />
          <View style={styles.contextText}>
            <Text style={styles.contextDriver}>NORRIS</Text>
            <Text style={styles.contextAction}> BOXING.</Text>
          </View>
          <Text style={styles.contextSub}>
            Decisive pit window open. Immediate instruction required from the pit wall.
          </Text>
        </View>

        {/* Condition pills */}
        <View style={styles.pills}>
          <View style={styles.pill}>
            <View style={[styles.pillDot, { backgroundColor: '#FF8800' }]} />
            <Text style={styles.pillText}>DRY / 28°C</Text>
          </View>
          <View style={styles.pill}>
            <View style={[styles.pillDot, { backgroundColor: Colors.CYAN }]} />
            <Text style={styles.pillText}>P1 GAP: 3.2s</Text>
          </View>
          <View style={styles.pill}>
            <View style={[styles.pillDot, { backgroundColor: Colors.GREEN }]} />
            <Text style={styles.pillText}>13 LAPS LEFT</Text>
          </View>
        </View>

        {/* Question */}
        <Text style={styles.question}>
          WHICH COMPOUND MAXIMIZES ECO-POINTS?
        </Text>

        {/* Compound selector */}
        <CompoundSelector
          disabled={windowClosed}
          onSelect={handleSelect}
        />

        {/* Selection result */}
        {selectedCompound && !windowClosed && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>SELECTED</Text>
            <Text style={[styles.resultValue, {
              color: selectedCompound === 'soft' ? Colors.SCUDERIA_RED
                : selectedCompound === 'medium' ? Colors.YELLOW
                  : Colors.WHITE
            }]}>
              {selectedCompound.toUpperCase()} COMPOUND ✓
            </Text>
          </View>
        )}

        {/* Window closed overlay */}
        {windowClosed && !selectedCompound && (
          <View style={styles.closedBox}>
            <Text style={styles.closedIcon}>🚫</Text>
            <Text style={styles.closedTitle}>WINDOW CLOSED</Text>
            <Text style={styles.closedSub}>The pit window has expired. Strategy locked.</Text>
          </View>
        )}

        {/* Spacer for countdown bar */}
        <View style={{ flex: 1, minHeight: 40 }} />
      </ScrollView>

      {/* Countdown bar pinned to bottom */}
      <View style={styles.countdownWrapper}>
        <CountdownBar
          running={timerStarted && !windowClosed}
          onExpire={() => setWindowClosed(true)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.OLED_BLACK,
  },
  scroll: { flex: 1 },
  content: {
    paddingBottom: 60,
    gap: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 4,
  },
  headerSub: {
    fontSize: 10,
    color: Colors.GRAY,
    letterSpacing: 4,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.WHITE,
    lineHeight: 38,
    letterSpacing: 1,
  },
  lapBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: Colors.RED_DIM,
    borderWidth: 1,
    borderColor: Colors.SCUDERIA_RED + '60',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lapBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.SCUDERIA_RED,
    letterSpacing: 2,
  },
  contextBlock: {
    paddingHorizontal: 20,
    gap: 8,
  },
  contextLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.SCUDERIA_RED,
    shadowColor: Colors.SCUDERIA_RED,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  contextText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  contextDriver: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.WHITE,
    letterSpacing: 2,
  },
  contextAction: {
    fontSize: 28,
    fontWeight: '300',
    color: Colors.LIGHT_GRAY,
  },
  contextSub: {
    fontSize: 13,
    color: Colors.GRAY,
    lineHeight: 20,
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.GLASS,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.GLASS_BORDER,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  pillText: {
    fontSize: 10,
    color: Colors.LIGHT_GRAY,
    fontWeight: '600',
    letterSpacing: 1,
  },
  question: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.CYAN,
    letterSpacing: 2,
    paddingHorizontal: 20,
    textShadowColor: Colors.CYAN,
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 0 },
  },
  resultBox: {
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: 'rgba(0,255,136,0.07)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.2)',
    gap: 2,
  },
  resultLabel: {
    fontSize: 9,
    color: Colors.GRAY,
    letterSpacing: 3,
    fontWeight: '700',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closedBox: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: Colors.RED_DIM,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.SCUDERIA_RED + '40',
    alignItems: 'center',
    gap: 6,
  },
  closedIcon: {
    fontSize: 28,
  },
  closedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.SCUDERIA_RED,
    letterSpacing: 3,
  },
  closedSub: {
    fontSize: 12,
    color: Colors.LIGHT_GRAY,
    textAlign: 'center',
  },
  countdownWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.OLED_BLACK,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
});

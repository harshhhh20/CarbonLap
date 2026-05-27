import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

interface PowerUnitSplitProps {
  mguKPercent: number;  // 0–100
  icePercent: number;   // 0–100
  mguKValue: number;    // display kW
  iceValue: number;     // display kg/h
}

function NeonBar({ percent, color, glowColor }: { percent: number; color: string; glowColor: string }) {
  const widthAnim = useRef(new Animated.Value(percent)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percent,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  return (
    <View style={styles.barTrack}>
      <Animated.View
        style={[
          styles.barFill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: color,
            shadowColor: glowColor,
            shadowRadius: 8,
            shadowOpacity: 0.9,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      />
    </View>
  );
}

export function PowerUnitSplit({ mguKPercent, icePercent, mguKValue, iceValue }: PowerUnitSplitProps) {
  return (
    <View style={styles.container}>
      {/* MGU-K */}
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <View style={[styles.dot, { backgroundColor: Colors.CYAN, shadowColor: Colors.CYAN }]} />
          <Text style={[styles.label, { color: Colors.CYAN }]}>MGU-K REGEN</Text>
          <Text style={styles.value}>{mguKValue.toFixed(1)} <Text style={styles.unit}>kW</Text></Text>
        </View>
        <NeonBar percent={mguKPercent} color={Colors.CYAN} glowColor={Colors.NEON_CYAN} />
      </View>

      {/* ICE */}
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <View style={[styles.dot, { backgroundColor: Colors.SCUDERIA_RED, shadowColor: Colors.SCUDERIA_RED }]} />
          <Text style={[styles.label, { color: Colors.SCUDERIA_RED }]}>COMBUSTION</Text>
          <Text style={styles.value}>{iceValue.toFixed(1)} <Text style={styles.unit}>kg/h</Text></Text>
        </View>
        <NeonBar percent={icePercent} color={Colors.SCUDERIA_RED} glowColor={Colors.NEON_RED} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
  },
  row: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.WHITE,
  },
  unit: {
    fontSize: 11,
    color: Colors.LIGHT_GRAY,
    fontWeight: '400',
  },
  barTrack: {
    height: 4,
    backgroundColor: '#1C1C1C',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    elevation: 4,
  },
});

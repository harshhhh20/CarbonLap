import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

// Animated SVG Path
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Arc geometry constants
const SIZE = 220;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 88;
const START_ANGLE = -220; // degrees
const END_ANGLE = 40;
const ARC_SPAN = Math.abs(END_ANGLE - START_ANGLE); // 260 degrees
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = (ARC_SPAN / 360) * CIRCUMFERENCE; // usable arc

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

const ARC_D = describeArc(CX, CY, RADIUS, START_ANGLE, END_ANGLE);

interface LiveRadialGaugeProps {
  value: number;    // 0–3 kg/s
  maxValue?: number;
}

export function LiveRadialGauge({ value, maxValue = 3 }: LiveRadialGaugeProps) {
  const progress = Math.min(Math.max(value / maxValue, 0), 1);
  // dashoffset: 0 = full arc shown, ARC_LENGTH = nothing shown
  const dashOffset = useSharedValue(ARC_LENGTH);

  useEffect(() => {
    dashOffset.value = withTiming(ARC_LENGTH * (1 - progress), {
      duration: 250,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const displayValue = value.toFixed(2);
  const percent = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Defs>
          <LinearGradient id="gaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={Colors.SCUDERIA_RED} />
            <Stop offset="100%" stopColor={Colors.CYAN} />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Path
          d={ARC_D}
          fill="none"
          stroke="#1C1C1C"
          strokeWidth={14}
          strokeLinecap="round"
        />

        {/* Animated fill arc */}
        <AnimatedPath
          d={ARC_D}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          animatedProps={animatedProps}
        />
      </Svg>

      {/* Center overlay */}
      <View style={styles.centerOverlay}>
        <Text style={styles.label}>LIVE CO₂</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>{displayValue}</Text>
          <Text style={styles.unit}>kg/s</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: progress > 0.6 ? Colors.RED_DIM : Colors.CYAN_DIM }]}>
          <Text style={[styles.pillText, { color: progress > 0.6 ? Colors.SCUDERIA_RED : Colors.CYAN }]}>
            {progress > 0.6 ? '▲ HIGH' : '▼ -12.4% VS AVG'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0, left: 0, right: 0, bottom: 0,
    paddingBottom: 20,
  },
  label: {
    fontSize: 10,
    color: Colors.LIGHT_GRAY,
    letterSpacing: 2.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  value: {
    fontSize: 38,
    fontWeight: '700',
    color: Colors.WHITE,
    lineHeight: 42,
  },
  unit: {
    fontSize: 13,
    color: Colors.LIGHT_GRAY,
    marginBottom: 6,
  },
  pill: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

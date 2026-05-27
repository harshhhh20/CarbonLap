import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';

interface TopBarProps {
  isRaceLive: boolean;
  lap: number;
  totalLaps: number;
}

export function TopBar({ isRaceLive, lap, totalLaps }: TopBarProps) {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* SVG Logo */}
      <View style={styles.logoRow}>
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7614 3.11929 17.2614 4.92893 19.0711"
            stroke={Colors.SCUDERIA_RED}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Path
            d="M12 12L18 6"
            stroke={Colors.SCUDERIA_RED}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.logoText}>CARBONLAP</Text>
      </View>

      {/* Live indicator */}
      {isRaceLive && (
        <View style={styles.liveRow}>
          <Animated.View style={[styles.liveDot, pulseStyle]} />
          <Text style={styles.liveText}>
            LIVE: LAP {lap}/{totalLaps}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.OLED_BLACK,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.WHITE,
    letterSpacing: 3,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(0,255,136,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.3)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.GREEN,
    shadowColor: Colors.GREEN,
    shadowRadius: 6,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.GREEN,
    letterSpacing: 1.5,
  },
});

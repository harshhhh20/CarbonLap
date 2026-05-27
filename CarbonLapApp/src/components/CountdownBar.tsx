import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

const DURATION = 10000; // 10 seconds

interface CountdownBarProps {
  onExpire: () => void;
  running: boolean;
}

export function CountdownBar({ onExpire, running }: CountdownBarProps) {
  const widthAnim = useRef(new Animated.Value(1)).current;
  const [expired, setExpired] = useState(false);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!running) return;
    widthAnim.setValue(1);
    setExpired(false);

    animRef.current = Animated.timing(widthAnim, {
      toValue: 0,
      duration: DURATION,
      useNativeDriver: false,
    });

    animRef.current.start(({ finished }) => {
      if (finished) {
        setExpired(true);
        onExpire();
      }
    });

    return () => {
      animRef.current?.stop();
    };
  }, [running]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>DECISION WINDOW</Text>
        <Text style={[styles.status, { color: expired ? Colors.SCUDERIA_RED : Colors.WHITE }]}>
          {expired ? 'WINDOW CLOSED' : '⏱ ACTIVE'}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.bar,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: expired ? Colors.SCUDERIA_RED : Colors.WHITE,
              shadowColor: expired ? Colors.SCUDERIA_RED : Colors.WHITE,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    color: Colors.GRAY,
    letterSpacing: 2,
    fontWeight: '700',
  },
  status: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  track: {
    height: 2,
    backgroundColor: '#1C1C1C',
    borderRadius: 1,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 1,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
});

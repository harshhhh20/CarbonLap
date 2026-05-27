import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';

// Try to import haptics, gracefully degrade if unavailable
let haptics: any = null;
try {
  haptics = require('react-native-haptic-feedback').default;
} catch {}

const COMPOUNDS = [
  { id: 'soft', label: 'SOFT', sublabel: 'MAX ATTACK', borderColor: Colors.SCUDERIA_RED, fillColor: Colors.RED_DIM, eco: 'LOW SUSTAINABILITY' },
  { id: 'medium', label: 'MEDIUM', sublabel: 'OPTIMAL FLOW', borderColor: Colors.YELLOW, fillColor: Colors.YELLOW_DIM, eco: '+45.2% EFFICIENCY', aiPick: true },
  { id: 'hard', label: 'HARD', sublabel: 'ENDURANCE', borderColor: Colors.WHITE, fillColor: 'rgba(255,255,255,0.05)', eco: 'CONSISTENCY FOCUS' },
] as const;

interface CompoundSelectorProps {
  disabled?: boolean;
  onSelect?: (compound: string) => void;
}

export function CompoundSelector({ disabled = false, onSelect }: CompoundSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePress = (id: string) => {
    if (disabled) return;
    setSelected(id);
    onSelect?.(id);
    if (haptics) {
      try {
        haptics.trigger('impactMedium', { enableVibrateFallback: true });
      } catch {}
    }
  };

  return (
    <View style={styles.container}>
      {COMPOUNDS.map((c) => {
        const isSelected = selected === c.id;
        return (
          <Pressable
            key={c.id}
            onPress={() => handlePress(c.id)}
            disabled={disabled}
            style={({ pressed }) => [
              styles.button,
              { borderColor: c.borderColor, backgroundColor: isSelected ? c.fillColor : 'transparent' },
              pressed && !disabled && styles.pressed,
              disabled && styles.disabledButton,
            ]}
          >
            {c.aiPick && (
              <View style={styles.aiPill}>
                <Text style={styles.aiPillText}>AI REC.</Text>
              </View>
            )}
            <Text style={[styles.compound, { color: isSelected ? c.borderColor : Colors.WHITE }]}>
              {c.label}
            </Text>
            <Text style={[styles.sublabel, { color: c.borderColor }]}>{c.sublabel}</Text>
            <Text style={[styles.eco, { color: Colors.LIGHT_GRAY }]}>{c.eco}</Text>
            {isSelected && (
              <View style={[styles.selectedBorder, { borderColor: c.borderColor, shadowColor: c.borderColor }]} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 110,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  disabledButton: {
    opacity: 0.3,
  },
  compound: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sublabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  eco: {
    fontSize: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  aiPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,255,255,0.15)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  aiPillText: {
    fontSize: 7,
    color: Colors.CYAN,
    fontWeight: '700',
    letterSpacing: 1,
  },
  selectedBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 14,
    borderWidth: 1,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});

import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { DriverData } from '../data/mockData';

interface DriverCarouselProps {
  drivers: DriverData[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const TEAM_INITIAL_COLORS: Record<string, string> = {
  MCLAREN: '#FF8000',
  FERRARI: '#FF2800',
  MERCEDES: '#00D2BE',
  'RED BULL': '#0600EF',
};

export function DriverCarousel({ drivers, selectedId, onSelect }: DriverCarouselProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>SELECT DRIVER</Text>
      <FlatList
        data={drivers}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={88}
        decelerationRate="fast"
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          const color = TEAM_INITIAL_COLORS[item.team] ?? Colors.WHITE;
          return (
            <Pressable
              onPress={() => onSelect(item.id)}
              style={({ pressed }) => [
                styles.avatar,
                isSelected && styles.avatarSelected,
                pressed && styles.avatarPressed,
                { borderColor: isSelected ? color : 'rgba(255,255,255,0.15)' },
              ]}
            >
              {/* Initials circle */}
              <View style={[styles.initials, { backgroundColor: isSelected ? color + '22' : 'transparent' }]}>
                <Text style={[styles.initialsText, { color: isSelected ? color : Colors.LIGHT_GRAY }]}>
                  {item.id}
                </Text>
              </View>
              <Text style={[styles.number, { color: isSelected ? color : Colors.GRAY }]}>
                #{item.number}
              </Text>
              {isSelected && (
                <View style={[styles.selectedDot, { backgroundColor: color, shadowColor: color }]} />
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: 3,
    color: Colors.GRAY,
    paddingHorizontal: 20,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
  },
  avatar: {
    width: 72,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.CARD_BG,
  },
  avatarSelected: {
    backgroundColor: '#111111',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  avatarPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  initials: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  number: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  selectedDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
});

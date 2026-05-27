import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Colors } from '../theme/colors';

interface SparklineProps {
  data: number[];   // e.g. [88, 91, 90, 94, 96]
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = Colors.CYAN, width = 64, height = 22 }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const pad = 2;

  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (width - pad * 2);
      const y = pad + ((maxVal - v) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { PitWallScreen } from '../screens/PitWall';
import { LeaderboardScreen } from '../screens/Leaderboard';
import { StrategyPredictorScreen } from '../screens/StrategyPredictor';
import { EcoDriverDayScreen } from '../screens/EcoDriverDay';
import { CalendarScreen } from '../screens/Calendar';
import { TeamsScreen } from '../screens/Teams';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

function TelemetryIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill={color}>
      <Path d="M4 4h4v16H4V4zm6 6h4v10h-4V10zm6-4h4v14h-4V6z" />
    </Svg>
  );
}
function StandingsIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </Svg>
  );
}
function StrategyIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M18 20V10M12 20V4M6 20v-6" />
    </Svg>
  );
}
function AwardsIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M12 15l-2 5-3-1 5-4 5 4-3 1-2-5z" />
      <Path d="M8 3v4l-2 1.5M16 3v4l2 1.5M12 3v4" />
      <Path d="M6 8.5C6 12 9 15 12 15s6-3 6-6.5H6z" />
    </Svg>
  );
}
function CalendarIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}
function TeamsIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M22 11l-4 4-2-2" />
    </Svg>
  );
}

const ROUTE_ICONS: Record<string, (c: string) => JSX.Element> = {
  PitWall:    (c) => <TelemetryIcon color={c} />,
  Leaderboard:(c) => <StandingsIcon color={c} />,
  Strategy:   (c) => <StrategyIcon  color={c} />,
  Awards:     (c) => <AwardsIcon    color={c} />,
  Calendar:   (c) => <CalendarIcon  color={c} />,
  Teams:      (c) => <TeamsIcon     color={c} />,
};

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.CYAN,
          tabBarInactiveTintColor: Colors.GRAY,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, focused }) => {
            const render = ROUTE_ICONS[route.name] ?? ROUTE_ICONS.PitWall;
            return (
              <View style={[styles.iconWrapper, focused && styles.iconActive]}>
                {render(color)}
                {focused && <View style={[styles.activeGlow, { shadowColor: Colors.CYAN }]} />}
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="PitWall"     component={PitWallScreen}           options={{ title: 'TELEMETRY' }} />
        <Tab.Screen name="Leaderboard" component={LeaderboardScreen}        options={{ title: 'STANDINGS' }} />
        <Tab.Screen name="Strategy"    component={StrategyPredictorScreen}  options={{ title: 'STRATEGY' }} />
        <Tab.Screen name="Awards"      component={EcoDriverDayScreen}       options={{ title: 'AWARDS' }} />
        <Tab.Screen name="Calendar"    component={CalendarScreen}           options={{ title: 'CALENDAR' }} />
        <Tab.Screen name="Teams"       component={TeamsScreen}              options={{ title: 'TEAMS' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#050505',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    height: 64,
    paddingBottom: 8,
    paddingTop: 4,
    shadowColor: Colors.OLED_BLACK,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  tabLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconActive: {
    // subtle active indicator
  },
  activeGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,255,255,0.06)',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});

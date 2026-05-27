// Mock live telemetry data types — F1 2026 Season
export interface DriverData {
  id: string;
  name: string;
  number: string;
  team: string;
  teamColor: string;
  co2Emission: number;    // kg/s, 0-3
  mguKPower: number;      // kW, 0-100 (percentage)
  icePower: number;       // % of max, 0-100
  efficiency: number;     // 0-100
  trend: number[];        // last 5 lap efficiencies
  co2Total: number;       // total kg this race
}

// 2026 grid — updated numbers & teams
// VER now runs #3 (defending champion's choice), Cadillac joins as 11th team
export const DRIVERS: DriverData[] = [
  {
    id: 'NOR', name: 'L. NORRIS', number: '1', team: 'MCLAREN',
    teamColor: '#FF8000',
    co2Emission: 1.24, mguKPower: 75, icePower: 40, efficiency: 94.2,
    trend: [88, 91, 90, 94, 94], co2Total: 87.4,
  },
  {
    id: 'RUS', name: 'G. RUSSELL', number: '63', team: 'MERCEDES',
    teamColor: '#00D2BE',
    co2Emission: 1.18, mguKPower: 82, icePower: 35, efficiency: 96.8,
    trend: [92, 94, 95, 96, 97], co2Total: 82.3,
  },
  {
    id: 'LEC', name: 'C. LECLERC', number: '16', team: 'FERRARI',
    teamColor: '#E8002D',
    co2Emission: 1.45, mguKPower: 60, icePower: 55, efficiency: 91.8,
    trend: [85, 88, 89, 91, 92], co2Total: 94.1,
  },
  {
    id: 'HAM', name: 'L. HAMILTON', number: '44', team: 'FERRARI',
    teamColor: '#E8002D',
    co2Emission: 1.39, mguKPower: 72, icePower: 50, efficiency: 92.4,
    trend: [87, 90, 91, 92, 92], co2Total: 91.8,
  },
  {
    id: 'VER', name: 'M. VERSTAPPEN', number: '3', team: 'RED BULL',
    teamColor: '#3671C6',
    co2Emission: 1.31, mguKPower: 68, icePower: 48, efficiency: 93.5,
    trend: [90, 92, 91, 93, 94], co2Total: 89.7,
  },
  {
    id: 'PIA', name: 'O. PIASTRI', number: '81', team: 'MCLAREN',
    teamColor: '#FF8000',
    co2Emission: 1.28, mguKPower: 71, icePower: 42, efficiency: 93.8,
    trend: [89, 91, 92, 93, 94], co2Total: 88.6,
  },
  {
    id: 'ANT', name: 'K. ANTONELLI', number: '12', team: 'MERCEDES',
    teamColor: '#00D2BE',
    co2Emission: 1.22, mguKPower: 78, icePower: 38, efficiency: 95.1,
    trend: [90, 93, 94, 95, 95], co2Total: 84.1,
  },
  {
    id: 'HAD', name: 'I. HADJAR', number: '6', team: 'RED BULL',
    teamColor: '#3671C6',
    co2Emission: 1.35, mguKPower: 64, icePower: 50, efficiency: 92.0,
    trend: [86, 89, 90, 91, 92], co2Total: 90.4,
  },
];

export const LEADERBOARD_DATA: DriverData[] = [...DRIVERS].sort(
  (a, b) => b.efficiency - a.efficiency
);

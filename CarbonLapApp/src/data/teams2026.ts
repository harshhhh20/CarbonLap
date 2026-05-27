// ─── F1 2026 Constructor & Driver Lineups ──────────────────────────────────

export interface Driver {
  code: string;        // e.g. "NOR"
  fullName: string;
  firstName: string;
  lastName: string;
  number: number;
  nationality: string;
  flag: string;
  isRookie: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;       // primary brand hex
  colorAlt: string;    // accent / secondary hex
  engine: string;
  drivers: [Driver, Driver];
  isNew: boolean;      // true for Cadillac (new entry)
}

export const TEAMS_2026: Team[] = [
  {
    id: 'mclaren',
    name: 'McLaren',
    shortName: 'MCL',
    color: '#FF8000',
    colorAlt: '#0090D0',
    engine: 'Mercedes',
    isNew: false,
    drivers: [
      {
        code: 'NOR', fullName: 'Lando Norris', firstName: 'Lando', lastName: 'Norris',
        number: 1, nationality: 'British', flag: '🇬🇧', isRookie: false,
      },
      {
        code: 'PIA', fullName: 'Oscar Piastri', firstName: 'Oscar', lastName: 'Piastri',
        number: 81, nationality: 'Australian', flag: '🇦🇺', isRookie: false,
      },
    ],
  },
  {
    id: 'mercedes',
    name: 'Mercedes',
    shortName: 'MER',
    color: '#00D2BE',
    colorAlt: '#C0C0C0',
    engine: 'Mercedes',
    isNew: false,
    drivers: [
      {
        code: 'RUS', fullName: 'George Russell', firstName: 'George', lastName: 'Russell',
        number: 63, nationality: 'British', flag: '🇬🇧', isRookie: false,
      },
      {
        code: 'ANT', fullName: 'Kimi Antonelli', firstName: 'Kimi', lastName: 'Antonelli',
        number: 12, nationality: 'Italian', flag: '🇮🇹', isRookie: true,
      },
    ],
  },
  {
    id: 'ferrari',
    name: 'Ferrari',
    shortName: 'FER',
    color: '#E8002D',
    colorAlt: '#FFCC00',
    engine: 'Ferrari',
    isNew: false,
    drivers: [
      {
        code: 'LEC', fullName: 'Charles Leclerc', firstName: 'Charles', lastName: 'Leclerc',
        number: 16, nationality: 'Monégasque', flag: '🇲🇨', isRookie: false,
      },
      {
        code: 'HAM', fullName: 'Lewis Hamilton', firstName: 'Lewis', lastName: 'Hamilton',
        number: 44, nationality: 'British', flag: '🇬🇧', isRookie: false,
      },
    ],
  },
  {
    id: 'redbull',
    name: 'Red Bull Racing',
    shortName: 'RBR',
    color: '#3671C6',
    colorAlt: '#CC1E4A',
    engine: 'Honda RBPT',
    isNew: false,
    drivers: [
      {
        code: 'VER', fullName: 'Max Verstappen', firstName: 'Max', lastName: 'Verstappen',
        number: 3, nationality: 'Dutch', flag: '🇳🇱', isRookie: false,
      },
      {
        code: 'HAD', fullName: 'Isack Hadjar', firstName: 'Isack', lastName: 'Hadjar',
        number: 6, nationality: 'French', flag: '🇫🇷', isRookie: true,
      },
    ],
  },
  {
    id: 'williams',
    name: 'Williams',
    shortName: 'WIL',
    color: '#005AFF',
    colorAlt: '#FFFFFF',
    engine: 'Mercedes',
    isNew: false,
    drivers: [
      {
        code: 'ALB', fullName: 'Alex Albon', firstName: 'Alex', lastName: 'Albon',
        number: 23, nationality: 'Thai', flag: '🇹🇭', isRookie: false,
      },
      {
        code: 'SAI', fullName: 'Carlos Sainz', firstName: 'Carlos', lastName: 'Sainz',
        number: 55, nationality: 'Spanish', flag: '🇪🇸', isRookie: false,
      },
    ],
  },
  {
    id: 'racingbulls',
    name: 'Racing Bulls',
    shortName: 'RB',
    color: '#6692FF',
    colorAlt: '#FFFFFF',
    engine: 'Honda RBPT',
    isNew: false,
    drivers: [
      {
        code: 'LAW', fullName: 'Liam Lawson', firstName: 'Liam', lastName: 'Lawson',
        number: 30, nationality: 'New Zealander', flag: '🇳🇿', isRookie: false,
      },
      {
        code: 'LIN', fullName: 'Arvid Lindblad', firstName: 'Arvid', lastName: 'Lindblad',
        number: 41, nationality: 'British', flag: '🇬🇧', isRookie: true,
      },
    ],
  },
  {
    id: 'astonmartin',
    name: 'Aston Martin',
    shortName: 'AMR',
    color: '#229971',
    colorAlt: '#CEDC00',
    engine: 'Mercedes',
    isNew: false,
    drivers: [
      {
        code: 'ALO', fullName: 'Fernando Alonso', firstName: 'Fernando', lastName: 'Alonso',
        number: 14, nationality: 'Spanish', flag: '🇪🇸', isRookie: false,
      },
      {
        code: 'STR', fullName: 'Lance Stroll', firstName: 'Lance', lastName: 'Stroll',
        number: 18, nationality: 'Canadian', flag: '🇨🇦', isRookie: false,
      },
    ],
  },
  {
    id: 'audi',
    name: 'Audi',
    shortName: 'AUD',
    color: '#C00000',
    colorAlt: '#C8C8C8',
    engine: 'Audi',
    isNew: true,
    drivers: [
      {
        code: 'HUL', fullName: 'Nico Hülkenberg', firstName: 'Nico', lastName: 'Hülkenberg',
        number: 27, nationality: 'German', flag: '🇩🇪', isRookie: false,
      },
      {
        code: 'BOR', fullName: 'Gabriel Bortoleto', firstName: 'Gabriel', lastName: 'Bortoleto',
        number: 5, nationality: 'Brazilian', flag: '🇧🇷', isRookie: true,
      },
    ],
  },
  {
    id: 'haas',
    name: 'Haas',
    shortName: 'HAS',
    color: '#B6BABD',
    colorAlt: '#E8002D',
    engine: 'Ferrari',
    isNew: false,
    drivers: [
      {
        code: 'OCO', fullName: 'Esteban Ocon', firstName: 'Esteban', lastName: 'Ocon',
        number: 31, nationality: 'French', flag: '🇫🇷', isRookie: false,
      },
      {
        code: 'BEA', fullName: 'Oliver Bearman', firstName: 'Oliver', lastName: 'Bearman',
        number: 87, nationality: 'British', flag: '🇬🇧', isRookie: false,
      },
    ],
  },
  {
    id: 'alpine',
    name: 'Alpine',
    shortName: 'ALP',
    color: '#FF69B4',
    colorAlt: '#0090FF',
    engine: 'Renault',
    isNew: false,
    drivers: [
      {
        code: 'GAS', fullName: 'Pierre Gasly', firstName: 'Pierre', lastName: 'Gasly',
        number: 10, nationality: 'French', flag: '🇫🇷', isRookie: false,
      },
      {
        code: 'COL', fullName: 'Franco Colapinto', firstName: 'Franco', lastName: 'Colapinto',
        number: 43, nationality: 'Argentine', flag: '🇦🇷', isRookie: false,
      },
    ],
  },
  {
    id: 'cadillac',
    name: 'Cadillac',
    shortName: 'CAD',
    color: '#A50F2D',
    colorAlt: '#C8C8C8',
    engine: 'Ferrari',
    isNew: true,
    drivers: [
      {
        code: 'PER', fullName: 'Sergio Pérez', firstName: 'Sergio', lastName: 'Pérez',
        number: 11, nationality: 'Mexican', flag: '🇲🇽', isRookie: false,
      },
      {
        code: 'BOT', fullName: 'Valtteri Bottas', firstName: 'Valtteri', lastName: 'Bottas',
        number: 77, nationality: 'Finnish', flag: '🇫🇮', isRookie: false,
      },
    ],
  },
];

// ─── Flat driver lookup ────────────────────────────────────────────────────
export const ALL_DRIVERS_2026 = TEAMS_2026.flatMap((t) =>
  t.drivers.map((d) => ({ ...d, team: t.name, teamId: t.id, teamColor: t.color }))
);

export function getTeamByDriverCode(code: string) {
  return TEAMS_2026.find((t) => t.drivers.some((d) => d.code === code));
}

export function getDriverByCode(code: string) {
  return ALL_DRIVERS_2026.find((d) => d.code === code);
}

export function getTeamColor(code: string): string {
  return getTeamByDriverCode(code)?.color ?? '#FFFFFF';
}

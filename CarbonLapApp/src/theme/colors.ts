export const Colors = {
  // Core backgrounds
  OLED_BLACK: '#000000',
  DARK_SURFACE: '#121212',
  CARD_BG: '#1C1C1E',
  GLASS: 'rgba(255,255,255,0.08)',
  GLASS_BORDER: 'rgba(255,255,255,0.15)',

  // Brand colors
  SCUDERIA_RED: '#E10600',
  CYAN: '#0A84FF',
  CYAN_DIM: 'rgba(10,132,255,0.15)',
  RED_DIM: 'rgba(225,6,0,0.15)',
  YELLOW: '#FFD60A',
  YELLOW_DIM: 'rgba(255,214,10,0.15)',
  WHITE: '#FFFFFF',
  GRAY: '#8E8E93',
  LIGHT_GRAY: '#C7C7CC',
  GREEN: '#32D74B',

  // Subtle glows (replaced neon)
  NEON_CYAN: 'rgba(10,132,255,0.2)',
  NEON_RED: 'rgba(225,6,0,0.2)',
  NEON_GREEN: 'rgba(50,215,75,0.2)',
};

export const Gradients = {
  GAUGE: ['#0A84FF', '#E10600'] as const,
  SHARE_BUTTON: ['#E10600', '#B30500'] as const,
  CARD_OVERLAY: ['transparent', 'rgba(0,0,0,0.8)'] as const,
};

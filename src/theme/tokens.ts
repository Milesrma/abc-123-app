/** Design tokens from SPEC section 7. */
export const colors = {
  bg: '#FFF8EC',
  primary: '#3BA7F5',
  secondary: '#FF7A59',
  numbers: '#FFC93C',
  shapes: '#4CC38A',
  ink: '#1F2A44',
  success: '#2ED8A3',
} as const;

export type ThemeColor = 'primary' | 'secondary' | 'numbers' | 'shapes';

export const sizes = {
  /** Minimum touch target (dp). Larger than the 48 dp adult standard. */
  touchTarget: 72,
  /** Minimum gap between touch targets (dp). */
  touchGap: 16,
  /** Learn-card glyph must fill at least this share of the screen height. */
  glyphMinHeightShare: 0.6,
  /** Any tap must react within this time (ms). */
  maxReactionMs: 100,
  /** Child screens show at most this many choices. */
  maxChoices: 4,
  /** Minimum font size (sp) for parent-area text. */
  parentMinFontSp: 16,
} as const;

export const fonts = {
  latin: 'Andika_400Regular',
  latinBold: 'Andika_700Bold',
} as const;

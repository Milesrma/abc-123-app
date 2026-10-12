import { colors, sizes } from '../src/theme/tokens';

describe('design tokens (SPEC section 7)', () => {
  it('uses the exact colour values', () => {
    expect(colors).toEqual({
      bg: '#FFF8EC', primary: '#3BA7F5', secondary: '#FF7A59', numbers: '#FFC93C',
      shapes: '#4CC38A', ink: '#1F2A44', success: '#2ED8A3',
    });
  });
  it('keeps toddler-sized touch targets', () => {
    expect(sizes.touchTarget).toBeGreaterThanOrEqual(72);
    expect(sizes.touchGap).toBeGreaterThanOrEqual(16);
    expect(sizes.maxReactionMs).toBeLessThanOrEqual(100);
    expect(sizes.maxChoices).toBe(4);
    expect(sizes.parentMinFontSp).toBeGreaterThanOrEqual(16);
  });
});

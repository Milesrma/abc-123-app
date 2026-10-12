import { buildPlaySequence, clampIndex, glyphFontSize, pageFromOffset, playableItems } from '../src/engine/learn';
import type { PackItem } from '../src/content/types';
import { getPack } from '../src/content/loader';

const item: PackItem = {
  id: 'x', glyph: 'B', word: { en: 'Ball', ar: 'كرة' },
  audio: { en: { name: 'en-name', word: 'en-word' }, ar: { name: 'ar-name', word: 'ar-word' } },
  image: 'img', tracing: null, free: true,
};

describe('learn engine', () => {
  it('clamps card indexes', () => {
    expect(clampIndex(-3, 26)).toBe(0);
    expect(clampIndex(99, 26)).toBe(25);
    expect(clampIndex(4.4, 26)).toBe(4);
    expect(clampIndex(5, 0)).toBe(0);
  });
  it('finds the page from the scroll offset', () => {
    expect(pageFromOffset(0, 400, 26)).toBe(0);
    expect(pageFromOffset(800, 400, 26)).toBe(2);
    expect(pageFromOffset(830, 400, 26)).toBe(2);
    expect(pageFromOffset(999999, 400, 26)).toBe(25);
    expect(pageFromOffset(100, 0, 26)).toBe(0);
  });
  it('makes the glyph at least 60% of the screen height', () => {
    expect(glyphFontSize(800)).toBeGreaterThanOrEqual(480);
    expect(glyphFontSize(360)).toBeGreaterThanOrEqual(216);
  });
  it('plays the name then the word', () => {
    expect(buildPlaySequence(item, 'en')).toEqual(['en-name', 'en-word']);
    expect(buildPlaySequence(item, 'ar')).toEqual(['ar-name', 'ar-word']);
  });
  it('plays English then Arabic in "both" mode', () => {
    expect(buildPlaySequence(item, 'both')).toEqual(['en-name', 'en-word', 'ar-name', 'ar-word']);
  });
  it('skips a language the item has no audio for', () => {
    const enOnly = { ...item, audio: { en: item.audio.en } };
    expect(buildPlaySequence(enOnly, 'both')).toEqual(['en-name', 'en-word']);
    expect(buildPlaySequence(enOnly, 'ar')).toEqual([]);
  });
  it('lists only free items while locked', () => {
    const paid = { ...item, id: 'p', free: false };
    expect(playableItems([item, paid], false)).toEqual([item]);
    expect(playableItems([item, paid], true)).toHaveLength(2);
  });
  it('builds a sequence for every real letter', () => {
    for (const it of getPack('english-letters')!.items) {
      expect(buildPlaySequence(it, 'en')).toHaveLength(2);
    }
  });
});

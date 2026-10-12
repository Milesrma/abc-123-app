import { sizes } from '../../theme/tokens';
import type { LanguageMode, PackItem } from '../../content/types';

/** Keeps a card index inside 0..count-1. */
export function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(Math.round(index), 0), count - 1);
}

/** Which card is showing, from the horizontal scroll offset. */
export function pageFromOffset(offsetX: number, pageWidth: number, count: number): number {
  if (pageWidth <= 0) return 0;
  return clampIndex(offsetX / pageWidth, count);
}

/** Glyph font size so the letter fills at least 60% of the screen height. */
export function glyphFontSize(screenHeight: number): number {
  return Math.round(screenHeight * sizes.glyphMinHeightShare);
}

/**
 * Audio files to play when a card is tapped: the name, then the picture word.
 * In "both" mode English comes first, then Arabic. Languages the item has no audio for are skipped.
 */
export function buildPlaySequence(item: PackItem, mode: LanguageMode): string[] {
  const langs = mode === 'both' ? (['en', 'ar'] as const) : ([mode] as const);
  const files: string[] = [];
  for (const lang of langs) {
    const clips = item.audio[lang];
    if (clips) files.push(clips.name, clips.word);
  }
  return files;
}

/** Items a child can use: free ones (paid packs unlock in a later milestone). */
export function playableItems(items: PackItem[], unlocked: boolean): PackItem[] {
  return unlocked ? items : items.filter((i) => i.free);
}

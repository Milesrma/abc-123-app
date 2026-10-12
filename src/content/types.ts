export type LanguageCode = 'en' | 'ar';
export type LanguageMode = 'en' | 'ar' | 'both';
export type ActivityId = 'learn' | 'trace' | 'find' | 'pop' | 'match';

export interface ItemAudio {
  /** Path under assets/, e.g. "audio/en/letters/a.ogg". */
  name: string;
  word: string;
}

export interface PackItem {
  id: string;
  glyph: string;
  word: Partial<Record<LanguageCode, string>>;
  audio: Partial<Record<LanguageCode, ItemAudio>>;
  /** Path under assets/. */
  image: string;
  /** Stroke data; null until the tracing milestone. */
  tracing: unknown | null;
  free: boolean;
}

export interface Pack {
  id: string;
  version: number;
  language: LanguageCode;
  theme: 'primary' | 'secondary' | 'numbers' | 'shapes';
  title: Partial<Record<LanguageCode, string>>;
  activities: ActivityId[];
  items: PackItem[];
}

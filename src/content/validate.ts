import type { Pack } from './types';

export class ManifestError extends Error {}

const THEMES = ['primary', 'secondary', 'numbers', 'shapes'];
const LANGS = ['en', 'ar'];

function fail(packId: string, msg: string): never {
  throw new ManifestError(`Pack "${packId}": ${msg}`);
}

/** Checks a raw JSON manifest and returns it typed. `hasAsset` tells whether a bundled file exists. */
export function validatePack(raw: unknown, hasAsset: (path: string) => boolean): Pack {
  const p = raw as Pack;
  const id = typeof p?.id === 'string' && p.id ? p.id : '(no id)';
  if (id === '(no id)') fail(id, 'missing "id"');
  if (!LANGS.includes(p.language)) fail(id, `bad language "${p.language}"`);
  if (!THEMES.includes(p.theme)) fail(id, `bad theme "${p.theme}"`);
  if (!p.title || typeof p.title !== 'object') fail(id, 'missing "title"');
  if (!Array.isArray(p.activities)) fail(id, 'missing "activities"');
  if (!Array.isArray(p.items) || p.items.length === 0) fail(id, 'has no items');

  const seen = new Set<string>();
  for (const item of p.items) {
    const where = `item "${item?.id}"`;
    if (!item?.id) fail(id, 'an item has no id');
    if (seen.has(item.id)) fail(id, `duplicate id "${item.id}"`);
    seen.add(item.id);
    if (!item.glyph) fail(id, `${where} has no glyph`);
    if (typeof item.free !== 'boolean') fail(id, `${where} needs a true/false "free" flag`);
    if (!item.word?.[p.language]) fail(id, `${where} has no word in ${p.language}`);
    const clips = item.audio?.[p.language];
    if (!clips) fail(id, `${where} has no ${p.language} audio`);
    for (const file of [clips.name, clips.word, item.image]) {
      if (!file || !hasAsset(file)) fail(id, `${where} points at missing file "${file}"`);
    }
  }
  return p;
}

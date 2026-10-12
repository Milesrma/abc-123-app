import englishLetters from './packs/english-letters.json';
import { assetRegistry } from './assetRegistry';
import type { Pack } from './types';
import { validatePack } from './validate';

/** Add new packs here (and drop their JSON in ./packs). No other code changes. */
const RAW_PACKS: unknown[] = [englishLetters];

const hasAsset = (path: string) => path in assetRegistry;

let cache: Pack[] | null = null;

export function getPacks(): Pack[] {
  if (!cache) cache = RAW_PACKS.map((raw) => validatePack(raw, hasAsset));
  return cache;
}

export function getPack(id: string): Pack | undefined {
  return getPacks().find((p) => p.id === id);
}

/** Turns a manifest file path into something `<Image>` / the audio player can load. */
export function resolveAsset(path: string): number {
  const asset = assetRegistry[path];
  if (asset === undefined) throw new Error(`Asset not bundled: ${path}`);
  return asset;
}

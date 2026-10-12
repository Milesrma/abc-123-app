import fs from 'fs';
import path from 'path';
import { getPack, getPacks, resolveAsset } from '../src/content/loader';
import { assetRegistry } from '../src/content/assetRegistry';
import { ManifestError, validatePack } from '../src/content/validate';
import englishRaw from '../src/content/packs/english-letters.json';

const WORDS = ['Apple', 'Ball', 'Cat', 'Dog', 'Elephant', 'Fish', 'Grapes', 'Hat', 'Ice cream', 'Juice', 'Kite',
  'Lion', 'Moon', 'Nest', 'Orange', 'Pig', 'Queen', 'Rainbow', 'Sun', 'Tree', 'Umbrella', 'Van', 'Whale',
  'Xylophone', 'Yo-yo', 'Zebra'];

const always = () => true;
const clone = () => JSON.parse(JSON.stringify(englishRaw));

describe('English letters pack', () => {
  const pack = getPack('english-letters')!;

  it('loads and has 26 letters A to Z in order', () => {
    expect(getPacks()).toHaveLength(1);
    expect(pack.items.map((i) => i.glyph).join('')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  });

  it('uses the picture words from the spec', () => {
    expect(pack.items.map((i) => i.word.en)).toEqual(WORDS);
  });

  it('is entirely free (SPEC section 2)', () => {
    expect(pack.items.every((i) => i.free)).toBe(true);
  });

  it('only offers the Learn activity for now', () => {
    expect(pack.activities).toEqual(['learn']);
  });

  it('has every referenced file on disk and bundled', () => {
    for (const item of pack.items) {
      const a = item.audio.en!;
      for (const f of [a.name, a.word, item.image]) {
        expect(fs.existsSync(path.join(__dirname, '..', 'assets', f))).toBe(true);
        expect(resolveAsset(f)).toBeDefined();
      }
    }
  });

  it('has a registry with no entries for missing files', () => {
    for (const f of Object.keys(assetRegistry)) {
      expect(fs.existsSync(path.join(__dirname, '..', 'assets', f))).toBe(true);
    }
  });
});

describe('validatePack', () => {
  it('accepts the real pack', () => {
    expect(() => validatePack(clone(), always)).not.toThrow();
  });
  it('rejects a missing audio/image file', () => {
    expect(() => validatePack(clone(), (f) => f !== 'images/en/a.png')).toThrow(/missing file "images\/en\/a.png"/);
  });
  it('rejects duplicate ids', () => {
    const p = clone();
    p.items[1].id = p.items[0].id;
    expect(() => validatePack(p, always)).toThrow(ManifestError);
  });
  it('rejects an item with no free/paid flag', () => {
    const p = clone();
    delete p.items[0].free;
    expect(() => validatePack(p, always)).toThrow(/free/);
  });
  it('rejects an empty pack and a bad theme', () => {
    const empty = clone(); empty.items = [];
    expect(() => validatePack(empty, always)).toThrow(/no items/);
    const theme = clone(); theme.theme = 'pink';
    expect(() => validatePack(theme, always)).toThrow(/theme/);
  });
  it('rejects an item missing its word', () => {
    const p = clone();
    p.items[3].word = {};
    expect(() => validatePack(p, always)).toThrow(/no word/);
  });
  it('rejects non-objects', () => {
    expect(() => validatePack(null, always)).toThrow(ManifestError);
  });
});

describe('getPack', () => {
  it('returns undefined for an unknown pack', () => {
    expect(getPack('nope')).toBeUndefined();
  });
  it('throws for an asset that is not bundled', () => {
    expect(() => resolveAsset('audio/nope.ogg')).toThrow(/not bundled/);
  });
});

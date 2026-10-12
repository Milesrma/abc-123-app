# Learn Numbers and Letters

Android learning app for ages 2 to 5. Full product spec: [SPEC.md](SPEC.md).

**Status: Milestone 1** (foundation, English A to Z pack, Learn activity). Art and voices are placeholders.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Installs everything |
| `npm test` | Runs the logic tests |
| `npm run typecheck` | Checks the TypeScript |
| `npm run assets` | Rebuilds `src/content/assetRegistry.ts` after adding/removing files in `assets/audio` or `assets/images` |
| `python3 scripts/generate-english-pack.py` | Regenerates the placeholder art, audio and English manifest |

## Adding or replacing content

Content is data (SPEC section 2). A pack is one JSON file in `src/content/packs/`, listed in `src/content/loader.ts`.
To swap in final art or voice, replace the file in `assets/` with the same name.

## Building the preview APK

See the GitHub workflow in `.github/workflows/preview-apk.yml` or run `npx eas-cli build --platform android --profile preview`.

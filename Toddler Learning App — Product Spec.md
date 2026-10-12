# Learn Numbers and Letters — Product Spec

Oct 12, 2026 · @Amr

## 1. Overview

Learn Numbers and Letters is a bilingual (English + Arabic) Android learning app for children aged 2 to 5 that teaches letters, numbers, colors and shapes by look, sound and finger tracing, fully offline, with no ads and a protected parent area.

**Who it is for**

- **Child (2 to 5 years):** cannot read, taps and swipes, short attention span (2 to 5 minutes per activity), needs instant audio and visual feedback.
- **Parent:** wants safe screen time, visible progress, a time limit, and the phone locked to this one app.

**Platform:** Android phones and tablets only (v1). Built with a cross-platform stack so an iPhone version can follow without a rewrite.

**Goals for v1 (the full launch version, not a prototype)**

1. Teach English A to Z, Arabic أ to ي, numbers 1 to 20 in both languages, 10 colors and 8 shapes.
2. Every item can be seen, heard (studio-quality voice) and traced with a finger.
3. Works 100% offline after install, no account, no ads, no data leaves the phone.
4. Free core content plus a one-time in-app purchase that unlocks everything else.
5. Parent area with progress tracking, a screen-time limit and a one-tap Lock mode.
6. Published on Google Play under the Families program.

**Out of scope for v1:** iPhone, multiple child profiles, cloud sync, accounts, letter connecting forms in Arabic (isolated letters only), words and reading.

**Decisions**

- [x] App name: Learn Numbers and Letters
- [x] Mascot: a bunny teacher (original character) who greets the child, demonstrates tracing strokes, celebrates rewards and naps on the rest screen
- [x] Price: US$5 one-time for Full Unlock
- [x] Voice: pre-generated studio-quality AI voices (one warm English voice, one warm Arabic voice), every clip checked by a native speaker

## 2. Learning content

The app ships 102 learning items across six packs; each item = a glyph or swatch, a picture word, voice audio in its language, and tracing data where it applies.

| Pack | Items | Free or paid | Tracing |
| --- | --- | --- | --- |
| English letters A to Z | 26 | Free | Yes (uppercase in v1) |
| Numbers 1 to 10 (English + Arabic audio) | 10 | Free | Yes |
| Numbers 11 to 20 | 10 | Paid | Yes |
| Arabic letters أ to ي | 28 | Paid | Yes (isolated form) |
| Arabic-Indic numerals ١ to ١٠ | 10 | Paid | Yes |
| Colors | 10 | Paid | No |
| Shapes | 8 | Paid | Yes |

**English letters (letter: word)**

A Apple · B Ball · C Cat · D Dog · E Elephant · F Fish · G Grapes · H Hat · I Ice cream · J Juice · K Kite · L Lion · M Moon · N Nest · O Orange · P Pig · Q Queen · R Rainbow · S Sun · T Tree · U Umbrella · V Van · W Whale · X Xylophone · Y Yo-yo · Z Zebra

**Arabic letters (letter: word)**

أ أرنب · ب بطة · ت تفاحة · ث ثعلب · ج جمل · ح حصان · خ خروف · د دب · ذ ذرة · ر رمان · ز زرافة · س سمكة · ش شمس · ص صوص · ض ضفدع · ط طائرة · ظ ظرف · ع عصفور · غ غزال · ف فيل · ق قطة · ك كرة · ل ليمون · م موز · ن نحلة · هـ هدهد · و وردة · ي يد

**Numbers:** each number shows the digit plus that many objects to count (3 = three ducks). English audio says "three", Arabic audio says "ثلاثة". Arabic-Indic numerals ١٢٣ use the same objects.

**Colors:** red, blue, yellow, green, orange, purple, pink, brown, black, white. Each shows a swatch plus a familiar object of that color (red apple, yellow sun).

**Shapes:** circle, square, triangle, rectangle, star, heart, oval, diamond. Each shows the outline shape plus a real object with that shape (circle = wheel).

**Language modes** (set by the parent): English only, Arabic only, or Both. In Both, every item plays English then Arabic audio.

**Content is data, not code:** all items live in one JSON manifest per pack (id, glyph, word EN/AR, audio files, image file, tracing paths, free/paid flag), so new packs can be added without changing app code.

## 3. Core features and activities

Each pack offers five activities, all voice-led so a child who cannot read can play alone, and none of them ever shows a "wrong" or failure state.

| Activity | What the child does | Learning goal |
| --- | --- | --- |
| Learn | Swipes through giant cards; tap = hear the name and word, the picture animates | Recognize the shape and sound |
| Trace | Follows the glyph with a finger along guided strokes | Shape memory, fine motor skills |
| Find it | Voice asks "Where is B?", child taps the right one of 2 to 4 | Recall by sound |
| Pop | Balloons float up carrying letters or numbers; pop the one the voice calls | Fast recognition, fun |
| Match | Drag the letter to its picture (B to ball), or the number to its group of objects | Link glyph to meaning |

**Tracing engine (the hero feature)**

- Each glyph has stroke data: ordered strokes, each a path with a start dot and direction arrow.
- The child's finger must stay within a tolerance band around the path; the band is wide at level 1 and narrows at levels 2 and 3.
- A stroke completes at 85% path coverage in the right direction; the ink fills with color and sparkles.
- Off-path movement does nothing (no red, no buzz); after 3 seconds of no progress, an animated hand demonstrates the stroke.
- Arabic strokes run right to left and include dot placement as a final stroke.
- Drawing runs at 60 fps or better on a mid-range phone.

**Feedback and rewards**

- Every correct action: voice praise (rotating set of 10+ phrases per language), confetti or a character dance, a light haptic tap.
- Wrong tap: the correct item gently wiggles and the voice repeats the prompt. No negative sounds.
- Sticker book: each completed activity earns a sticker; filling a page unlocks a mascot animation.

**Smart repetition**

- The app tracks every item: times seen, times correct in Find it, Pop and Match, tracing level reached.
- An item is **mastered** after 3 correct recalls on different days.
- Activities pick 70% items in progress and 30% mastered items for review, so weak items return more often.

## 4. Screens and user flow

The child moves through only five screens, from Home to Pack menu to Activity to Reward and back; every parent screen sits behind the parental gate.

&#91;embedded content: screen flow · 6 child screens, 7 parent screens\]

The rest screen can appear over any child screen when the daily limit ends, and only a parent passing the gate can dismiss it.

| Screen | What it shows |
| --- | --- |
| Splash | Mascot waves and says hello in the chosen language (under 2 seconds) |
| Home | One giant picture button per pack (ABC, أ ب ت, 123, ١٢٣, colors, shapes); hidden hold-to-open gear in a corner |
| Pack menu | Five activity buttons as pictures, plus a big Home button |
| Activity | Full-screen activity with a Home button only; progress dots at the bottom |
| Reward | Short celebration, sticker earned, then back to Pack menu automatically |
| Rest screen | Sleeping mascot, calm music, no buttons the child can use |
| Parental gate | Number-in-words challenge with a numeric keypad |
| Parent home | Tiles for Progress, Screen time, Lock mode, Settings, Full Unlock, and Back to child |

## 5. Parent area

Everything a parent controls sits behind a parental gate, reached from a small, hold-to-open gear icon in a corner of the home screen.

**Parental gate**

- Hold the gear for 3 seconds, then answer a question a toddler cannot: "Type the number forty-seven" with numbers written as words (random each time).
- The gate also protects the purchase screen, the Lock mode toggle and any link that leaves the app.

**Progress**

- One screen per pack: a grid of every item colored by state (not started, learning, mastered).
- Totals: items mastered per pack, minutes played today and in the last 7 days, favorite activity.
- Tap an item to see times seen, correct recalls and tracing level.
- All data stays on the phone; a Reset progress button (behind a second confirmation) clears it.

**Screen-time limit**

- Daily limit options: off, 10, 15, 20, 30, 45 or 60 minutes.
- 2 minutes before the end, the mascot yawns; at the limit, a calm "time to rest" scene plays and the app locks until a parent passes the gate or the next day starts.

**Lock mode (keep her in the app)**

- One toggle starts Android screen pinning from inside the app, so the child cannot leave to other apps; the parent's PIN, pattern or fingerprint unpins it.
- First-time setup screen explains in pictures how to enable "App pinning" in Android settings if it is off.

**Settings**

- Language mode: English, Arabic, Both.
- Music on/off, voice volume, haptics on/off.
- Tracing difficulty: auto (default) or fixed level 1, 2 or 3.
- Unlock full app, Restore purchase, Privacy policy (opens only after the gate).

## 6. Monetization

The app is free to download with English A to Z and numbers 1 to 10 fully playable in all five activities; one one-time purchase, "Full Unlock", opens every other pack and all future packs in v1.x.

- **Billing:** Google Play Billing, one non-consumable in-app product (`full_unlock`). No subscriptions in v1.
- **Price:** US$5 one-time; local prices per country set in Play Console, with Egypt priced lower than the Gulf, US and Europe.
- **Locked content:** shown with a small padlock and its real artwork, so parents see the value; tapping it as a child does nothing except a gentle "ask a grown-up" voice line.
- **Purchase flow:** only inside the parent area, behind the parental gate. Unlock is stored locally and re-checked with Google Play on each launch when online; Restore purchase button for new phones.
- **No ads, ever.** No third-party ad or tracking SDKs.
- **Later options (not v1):** new packs as separate purchases (animals, body parts, French), and a family subscription if the content library grows.

## 7. Design system

The look is bright but calm, with huge touch targets, one thing on screen at a time, and motion and sound on every interaction.

**Toddler UX rules**

- Touch targets at least 72 dp (larger than the 48 dp adult standard); 16 dp minimum gap between targets.
- No text the child must read. Every control is an icon or picture, and every screen speaks its instruction.
- Maximum 4 choices on screen at once. No scrolling in child screens; swipe left/right only.
- Any tap gives a reaction within 100 ms (sound, bounce or both).
- Accidental-exit protection: the Android back gesture inside child screens returns to the pack menu, never closes the app.
- Portrait and landscape both supported; layouts adapt to tablets.

**Color tokens**

| Token | Use | Value |
| --- | --- | --- |
| bg | App background | Warm cream #FFF8EC |
| primary | Main buttons, English pack | Sky blue #3BA7F5 |
| secondary | Arabic pack | Coral #FF7A59 |
| numbers | Numbers packs | Sunny yellow #FFC93C |
| shapes | Colors and shapes packs | Leaf green #4CC38A |
| ink | Glyphs and outlines | Deep navy #1F2A44 |
| success | Completed strokes, stars | Mint #2ED8A3 |

The colors pack uses true colors for its own swatches. A dark theme is not needed for v1.

**Typography**

- Latin glyphs: [Andika](https://fonts.google.com/specimen/Andika) (SIL, built for early literacy: single-story a and g).
- Arabic glyphs: [Baloo Bhaijaan 2](https://fonts.google.com/specimen/Baloo+Bhaijaan+2) (rounded, friendly); check every letter's dots against a Naskh reference before launch.
- Parent area text: the same fonts at normal sizes, 16 sp minimum.
- Learn-card glyphs fill at least 60% of the screen height.

**Motion and sound**

- Mascot and reward animations in Rive (interactive, small files); UI motion with Reanimated springs.
- Soft background music loop per pack (toggleable), short UI sounds, all normalized to the same loudness.
- Respect the system "remove animations" setting by replacing large motion with fades.

**Arabic and RTL**

- Arabic-only mode mirrors the layout (right-to-left); Both mode keeps the layout left-to-right but renders Arabic text and tracing right-to-left.
- Arabic-Indic numerals render in the Arabic font, never as substituted Latin digits.

## 8. Technical architecture

The app is a React Native app built with Expo in TypeScript, fully offline with no backend, so the same code can later ship to iPhone.

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Expo (latest stable SDK), React Native, TypeScript strict | One codebase, cloud builds, iPhone later |
| Navigation | Expo Router | File-based screens, simple deep structure |
| Tracing and drawing | React Native Skia | GPU drawing at 60 fps+, path hit-testing |
| Gestures and animation | React Native Gesture Handler + Reanimated | Native-thread touch and motion |
| Character animation | Rive runtime for React Native | Small interactive animations |
| Audio | expo-audio, sounds preloaded per pack | Instant playback, no lag on tap |
| Local data | expo-sqlite (progress), MMKV (settings) | Fast, fully on-device |
| State | Zustand | Small and simple |
| Purchases | Google Play Billing via react-native-iap | No third-party data processor |
| Lock mode | Small custom Expo native module calling Android `startLockTask()` | Screen pinning from inside the app |
| Builds | EAS Build (Android App Bundle for Play, APK for testing) | No Android Studio needed |
| Tests | Jest (logic), Maestro (end-to-end flows on device) | Catch regressions each milestone |

**Rules for the code**

- All content and assets bundled in the app; zero network calls except Google Play Billing.
- No analytics, crash or ad SDKs. Crash data comes from Play Console's Android vitals.
- Content loaded from JSON manifests (section 2); one generic activity engine per activity type, never per-letter code.
- Target the minimum and target Android API levels Google Play requires at submission time.
- Performance budget: cold start under 2 seconds on a mid-range phone; app download under 150 MB (compressed audio and vector art).

**Folder structure**

```
app/            screens (Expo Router)
  (child)/      home, pack menu, activities
  (parent)/     gate, progress, settings, purchase
src/engine/     learn, trace, find, pop, match engines
src/content/    pack manifests (JSON) + loader
src/data/       SQLite progress store, settings store
src/audio/      preload + playback queue
src/billing/    Play Billing wrapper
modules/lock-task/  native Android module
assets/         audio/, images/, rive/, fonts/, tracing/
```

## 9. Child safety, privacy and Play policy

The app collects no data at all, which keeps it simple to approve under Google Play's Families policy and children's privacy laws.

- **No data collection:** no accounts, no names, no photos, no microphone, no location, no advertising ID, no device identifiers. Progress stays on the phone.
- **Permissions:** none beyond what Play Billing needs. The manifest must not request the advertising ID permission.
- **Data safety form in Play Console:** declare "No data collected, no data shared".
- **Target audience:** ages 5 and under, which places the app under the Families policy and its review.
- **No external links or social features** in child screens; anything that leaves the app sits behind the parental gate.
- **Privacy policy:** a short page stating no data is collected, hosted at a public URL (required by Play), in English and Arabic.
- **Content:** all illustrations and sounds age-appropriate; no violence, no scary sounds, no flashing above 3 flashes per second.
- Before submission, re-read Google Play's current Families policy and Data safety requirements in Play Console, since they change.

## 10. Assets and content production

Art and voice decide whether the app feels premium, so they are produced as real assets, not generated live by the app.

| Asset | Count (approx.) | Spec | Who makes it |
| --- | --- | --- | --- |
| Item illustrations | 102 | Vector (SVG), one consistent flat style, transparent background | Illustrator or AI art, then cleaned by Amr in Illustrator |
| Mascot + reward animations | Bunny teacher, \~8 animations (wave, point, demonstrate, cheer, dance, think, yawn, sleep) | Rive file (.riv) | Rive animator (freelance) |
| Voice: item names + words | \~150 English + \~120 Arabic clips | Warm, slow, clear female voice; 48 kHz WAV masters, shipped as compressed OGG | Pre-generated studio-quality AI voice, every clip reviewed by a native speaker |
| Voice: prompts + praise | \~60 per language | Same voice | Same |
| Music + UI sounds | 4 loops, \~20 sounds | Royalty-free with commercial license | Licensed library |
| Tracing stroke data | 92 glyphs (all letters, numerals, shapes) | JSON paths per stroke, in glyph coordinates | Claude Code extracts from fonts, then hand-check |
| Store graphics | Icon, feature graphic, 8 screenshots | Play Console sizes | Amr |

**Rules**

- Placeholder art and robotic placeholder audio are fine during development; the manifest makes swapping in finals a file replacement only.
- Keep every source file (AI, PSD, WAV, RIV) in an `assets-source/` folder outside the app bundle.
- Pronunciation check: a native speaker listens to every Arabic clip; Egyptian-accented Modern Standard Arabic is acceptable, colloquial words are not.

## 11. Build plan

The app is built in six milestones, one Claude Code cloud session each, and every milestone ends with an installable APK tested on a real phone before the next starts.

| # | Milestone | Done when |
| --- | --- | --- |
| 1 | Foundation: Expo project, navigation, design tokens, content manifest loader, English pack with placeholder art, Learn activity | APK installs; child can swipe A to Z and hear each letter |
| 2 | Tracing engine on Skia, 3 difficulty levels, stroke data for English letters and numbers | Every English letter and number 1 to 20 traceable, 60 fps on Amr's phone |
| 3 | Find it, Pop and Match engines, rewards, sticker book, smart repetition | All five activities work for English and numbers; mastery logic passes unit tests |
| 4 | Arabic pack, Arabic-Indic numerals, colors, shapes, language modes, RTL | Arabic-only mode fully mirrored; all six packs playable |
| 5 | Parent area: gate, progress, screen-time limit, Lock mode, settings, Play Billing | Purchase and restore work on Play's test track; Lock mode pins the app |
| 6 | Final art, voice and Rive animations swapped in, performance pass, Maestro tests, store build | Release AAB under budget; all Maestro flows pass |

**How to run each milestone with Claude Code**

1. Save this spec in the repository as `SPEC.md` (export this doc as Markdown).
2. Start a cloud session on the repository and paste: *"Read SPEC.md. Build milestone N only, following the spec exactly. Write tests for the logic. When done, produce a preview APK with EAS Build and give me the install link. List anything in the spec you had to assume."*
3. Install the APK, test it with your daughter, and write down what to change.
4. In the same session, send the change list; when it is right, start the next milestone in a new session.

**One-time accounts you need** (Claude Code will tell you exactly where to click)

- GitHub (stores the code), free.
- Expo (builds the app in the cloud), free tier.
- Google Play Console, $25 one-time, needed from milestone 5 for billing tests.

## 12. Launch checklist

Publishing takes about three weeks after the app is finished, mostly because new personal Play developer accounts must run a closed test with real testers before going public.

- [ ] Create the Google Play Console account and complete identity verification
- [ ] Create the app, set target audience to ages 5 and under, accept the Families policy
- [ ] Set up the `full_unlock` in-app product and prices per country
- [ ] Publish the privacy policy page (English + Arabic) and add its URL
- [ ] Fill in the Data safety form (no data collected) and the content rating questionnaire
- [ ] Store listing in English and Arabic: name, short and long description, icon, feature graphic, screenshots
- [ ] Upload the release AAB to a closed test track
- [ ] Recruit testers (friends and parents) and run the closed test for the period Play Console requires (check the current tester count and days shown there)
- [ ] Fix issues from testers, then apply for production access
- [ ] Release to production, staged rollout starting at 20%

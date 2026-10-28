# Locked style - The Quest with Diksha clips

Inspired by Kallaway (@kallawaymarketing) explainers, adapted to a white brand theme. Copy the *language*, never his exact graphics.
Rewritten 2026-10-24 after Clips 2-5 (Clip 5 was approved after one round): everything below is current; nothing here contradicts the kit.

## Canvas and layouts (1080x1920, 24 fps)
| Layout | What is on screen | Use for |
|---|---|---|
| **split** | graphic panel 0-1260 px on top; speaker inset below: rounded box `left 54, top 1290, 972x630`, radius 44 44 0 0, runs off the bottom edge | every explained idea (the main layout) |
| **stack** | host top half, guest bottom half (1080x960 each), 6 px white seam | conversational beats, reactions, lines without a visual idea |
| **full** | one speaker full-frame (9:16 crop) | rarely: one emotional/punchy line for variety |
| **screen** | guest's screen share on top (fit to 1080 wide), guest inset below | whenever the guest shares a screen |

- The inset shows the person speaking. It may cut to the listener for a reaction, and it **must** switch camera exactly on an audio join.
- Layout changes land in pauses or on joins, never mid-word unless it is a camera switch with no join.
- Show Diksha's face regularly, but keep the graphic running (split with host inset) through a short host question or answer
  instead of cutting to stack. Keep the graphic up to the very last frame so the final pop settles.
- No speaker name labels. No on-screen captions. No jump punch-ins/zooms on footage (the editor adds zooms).

## Inset framing (the editor cares a lot)
Kallaway-style: hair 5-10% below the box top, head about 44% of the visible box height, shoulders filling the width, no empty ceiling.
Crop straight from 4K. If the person leans, check both extremes; the hair must never touch the edge. `tools/framing.py suggest` applies this.

## Look
- Background `#f6f8fb` with a 30 px dot grid (`#d5dce8`), a soft blue radial glow breathing slowly, a light vignette.
- Brand accent `#2563eb` only. Text `#0f172a`, muted `#64748b`. Light accents: `#dbeafe`, `#93c5fd`, `#bfdbfe`.
- Font: DM Sans (brand). Headlines 800 at 70-76 px, letter-spacing -0.035em, accent phrase in **italic 500 blue** (`<i>`).
  Real product UI uses that product's font (YouTube = Roboto).
- Cards: white, radius 28-36, soft shadow `0 30px 80px rgba(15,23,42,.12)`. Pills: blue with glow. No gradients on text, no left-edge accent stripes, no neon.
- Content fills the panel: graphics between about y 200 and 1180, no big gap above the inset. Centre rows truly centred (an off-centre row was a note).
- All on-screen text in **English**. If a real UI is in another language, translate the UI text itself; never add translation boxes.

## Motion language (LOCKED - helpers are in `tools/kit.js`, use them, do not redefine them)
Measured from the editor's references (`C:/Users/tsdzs/Downloads/Motion Reference/All in one Downloader/Twitter`) and tuned over
Clips 2-5: fast start, soft tail, never a dead stop, never rushed, one big motion at a time.

| Motion | Use | Never |
|---|---|---|
| Camera | `camPath` keys of **1.8-2.4 s**, ease `CAMV` (default). Few, long, calm moves; re-aim slowly toward the next focus between beats | expo.out over 1.0-1.4 s ("rushed", "like a cut"); moving the camera while a strip/list/carousel travels or points build in |
| Arrivals | `landS(el, t, from)` (SSP spring, ~8% overshoot, 1.2 s); content inside a card `softIn` | `bounce`, `back.out` pops on big cards, `power*.inOut` on anything that starts on a word |
| Morph | `morph(el, t, from, to)`: ONE element; clip-path (`ins()`), scale and position on the SAME spring (MSP, 1.3 s, ~3% overshoot); shared title/photo/thumbnail `flip()` on the same spring at the same time; the rest of the old UI fades (0.45 s) and the new content `softIn`s ~0.3 s later | squash/anticipation (rejected twice); a second box swapped in on top; scale on one spring + clip on another; colour/fill change mid-morph; doubled lines or overlapping copies mid-morph |
| Followers | anything riding something else (pin on globe, token on a path, label on a shape, cursor): compute in ONE `driver(fn)` from pure `K()` functions of time | flying to a precomputed spot then starting to follow |
| Exits | `fadeOut` (0.45 s power2.in + blur) or crossfade during a morph | hard cuts inside graphics; match cuts |
| Ambient | `breathe("#gfx")` runs the whole clip (template). Slow tails keep moving | motion blur / frame blending / tmix - never, in any render |

**Continuity.** No gap > 0.8 s without intended motion (a slow camera re-aim, a settling tail, a counter). Start the next beat during the
previous tail. Exception: hold the frame while a list/points build in (the points are the motion).

**Morph chains (what the editor loved).** Turn the SAME object into the next idea instead of replacing it:
viewfinder -> search bar (record dot -> YouTube logo), dropdown -> channel header -> full page, blurred scrub preview -> real first-video tile,
price tag -> checkout header band, Studio upload dialog -> home-feed tile, audience circle -> pyramid base, staircase line -> slider track.
Hand off between sections by pixel-matching shared thumbnails at the cut frame (the page dissolves around them).
A highlight that becomes a pill starts pixel-matched on the source text. Only morph related shapes; unrelated scene changes = blur-out / cascade-in.
A pure clip "window opening" over a large area: gentler start (`CAMV`, 1.4 s) and fade everything behind it first.

**Timing.** Start each change on the spoken word with `W()`, 0.05-0.15 s early. Never morph or start a scene before the line that talks about it.
Pre-roll entrances ~0.15 s before a cut into split. Let the last animation settle before the clip ends.

**Real UI.** When the talk is about YouTube/a real product, rebuild the real UI (Studio upload dialog, home feed, channel page, search,
watch page, Up next) with real assets (yt-dlp metadata, `i.ytimg.com` thumbnails, avatar/banner), never a made-up card and never a zoomed
screen recording. Cap camera zoom on full-width UI at ~1.08. Never scale words/numbers inside real UI text (overlaps neighbours):
colour + marker sweep only. "Disabled" thumbnails: B&W via an overlay with `mix-blend-mode: saturation` + light wash (~0.2), no CSS filter on cards with thumbnails.

**People and choices.** "Choosing between options" = Diksha's cursor (her photo in a name pill) hovering with `hesitate()` wobble, then a click
(ripple, press, selection outline). Never a hopping focus box, never cursor crowds as an "audience" (use sized circles / dimming / camera focus).

**Framing.** Everything stays >= 40 px inside the panel at every moment, including the worst case DURING moves:
breathing (+-9 px, 3%) x camera zoom x spring overshoot. Check camera keys at their peak, not only rest poses.

## Seek-safety gotchas (each one broke a past clip)
- Two tweens on the same element + property overlapping in time fight; `auditOverlaps()` fails `check` on them. Spring tweens are 1.2-1.3 s long:
  a later tween on that prop must start after.
- `fromTo` restates its from-value: start it only after the previous tween on that prop ended. Clip-path tweens always `fromTo` with an explicit
  start (`ins()` keeps the browser from collapsing all-equal insets). Elements that must stay hidden until later: `immediateRender: false`.
- Round-cap SVG paths show a dot before drawing: use `drawP`. Elements inside a clip-path are clipped too: pills that stick out of a row live outside it.
- `-shortest` when remuxing audio drops the last frame. Never use it.

## First-output checklist (run through it before the first draft; every item was a past rejection)
1. Every morph = `morph()` + `flip()` on one element, no squash, no box-on-box, no mid-morph colour change, no doubled lines.
2. Camera keys 1.8-2.4 s CAMV; nothing else big moves while the camera moves; peak-zoom framing >= 40 px.
3. Real UI rebuilt with real assets wherever a real product/person is named; English; no inline text scaling.
4. Graphic stays through short host lines and to the last frame; layout changes only on pauses/joins.
5. No cursor gags/crowds/hopping boxes; choices = hesitating photo cursor.
6. `qa.py --render` passes (check, overlaps, near-still <= 15%), one sheet looked at, no motion blur in the render.

## SFX (code-generated, separate track)
Soft whooshes on camera moves, gentle pops for arrivals, light ticks for counters/word reveals, one chime for the key number, clicks for cursors.
Peak -9 dBFS, never busy. `tools/sfx.py` + `assets/sfx_cues.json`.

## Editor feedback history (short; details in log/used.md)
- v1 of the series was rejected for tiny/low inset framing, captions, punch-ins, graphics popping in late and leaving abruptly, generic mockups.
- Clip 2: 5 rounds (slideshow motion, box-on-box morphs, pin not riding the globe, zoom pushing cards out, match cut, unasked motion blur).
- Clip 3: 3 rounds (rushed expo camera, cursor crowds, inline-scaled UI text, heavy white "disabled" wash).
- Clip 4: 2 rounds (mixed-timing squash morphs). Loved: MKBHD scrub preview growing into the video tile (one element, one spring).
- Clip 5: 1 round (made-up UI instead of real YouTube Studio/feed, hopping focus box, stack cut, squash crept back). Approved v2.
- Loved overall: real-UI storytelling, thumbnail -> circle orbit, one continuous dot-grid scene with calm camera, iOS notification -> Messages,
  feathered blue wipe, confetti + UI shake, Diksha's hesitating photo cursor, morph chains of the same object.

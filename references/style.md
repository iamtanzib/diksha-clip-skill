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
- No speaker name labels. No jump punch-ins/zooms on footage (the editor adds zooms).
- Studio (half) clips: burned-in captions on the seam (y 916-1008) and the Quest logo top-right - the template wires both from
  `assets/captions.json` (`tools/captions.py`); never add a second captions driver. Keep UI out of the logo corner (x 853-1026, y 84-208) and above the caption band.
- RULE (editor, 2026-10-29): never put an image or video from the clip's own footage inside a UI or graphic (two identical people confuse
  viewers). Use the editor's real photo of the person, the Memoji (Munnawar Clip 3 SVG for the speaker, Clip 2 `assets/memoji` PNGs for
  others), Apple emoji images (never Windows emoji glyphs) and clean SVG icons.

## Studio episodes in this style (Munnawar Clips 2-5, all approved)
Studio = Diksha and the guest in one room, no screen share. The editor wants THIS skill's casual white UI style for them (stickman only
when the editor names it). Layout `half`: animation top 1080x960, camera bottom 1080x960, white seam, captions on the seam, logo top-right.
- **Opening**: stacked cameras (guest top, Diksha bottom) until the line where the first explained idea starts (Diksha's question or the
  guest's setup stays on stack). Asked on Clips 3 and 4.
- **Who is in the bottom half**: the speaker. Diksha on screen for her whole question; the guest right before she asks; 3-5 short Diksha
  reaction cuts on pauses in long answers ("it's Diksha's clip"), never over the guest's key or closing line.
- **Captions + logo are mandatory** (forgotten on Clips 4 and 5 v1): the template adds them for any `half` layout. Run
  `python -I tools/captions.py` (back-to-back blocks, no gaps; add the clip's proper nouns to KEEP_CASE). Logo: black wordmark over the
  animation, colour logo with `mix-blend-mode: overlay` over camera-only frames. Captions 92 px bold DM Sans, letter-spacing -0.02em (not tighter).
- Panel centre is y 480 (kit handles it). The first graphic sits centred in that half, not in a corner.

## Composition and spacing ("cramped" = "BROKEN DESIGN" - noted on Clips 3, 4, 5)
- Centre the group in the panel (x 540, studio y 480); a lone element is centred, not parked at the side.
- Cards: >= 48-56 px inner padding, one left edge for title/subtitle/rows, each element on its own row, >= 24 px between rows.
- >= 40 px between separate objects; text never touches a circle/card edge; a label sits under its object with a clear gap.
- Nothing hugs the frame top: headlines and top bars start below the logo band (studio y >= 220) and are centred, never top-left.
- No text placed just to fill space; if a spot has no clean place for text, drop the text.
- Check every sheet for: off-centre groups, elements < 24 px apart, text under the logo/captions. Fix before sending.

## Assets inside graphics
- People: the editor's real photo (ask for it; fit it in the circle with object-fit cover) or a Memoji. NEVER stills/video from the clip's
  own footage, never self-made background removal (ask for the cutout).
- Emoji: Apple emoji PNGs (`assets/emoji`, template has a starter set; fetch more by codepoint), never Windows emoji glyphs.
- Icons: clean premium SVG (Lucide-like strokes or the product's real icon). No default OS glyphs (Windows location pin), no clip-art.
- No pills, stamps or labels the viewer cannot place ("I'm not sure what it is"); no filler words ("Yeah!"); no Like/Subscribe on non-YouTube UI.

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
**Read `references/motion.md` before storyboarding AND before writing scene code.** It holds the measured numbers, the
choreography of a state change, the approved recipes and the morph QA strip. The table below is the summary.
Measured from the editor's references (`C:/Users/tsdzs/Downloads/Motion Reference/All in one Downloader/Twitter`) and tuned over
Clips 2-5: fast start, soft tail, never a dead stop, never rushed, one big motion at a time.

| Motion | Use | Never |
|---|---|---|
| Camera | `camSpring` (w 4.5, ~1 s) with one key per state, started WITH the morph it frames (shape leads, camera follows, each state fills the frame); calm scenes may use `camPath` 1.8-2.4 s CAMV. One shake max per clip, for an impact word | expo.out 1.0-1.4 s ("rushed"); pushes that put text under the captions/logo; a camera still moving out when the next morph starts |
| Arrivals | content inside a MOVING shape: `swapIn` (blur 10 -> 0, 0.26 s); chrome on a settled card: `landS(el, t, {opacity:0, y:18, scale:0.94})`, no blur, staggered 0.04-0.07 s, top-down; free-standing objects: `landS` (SSP); words: `wordsLand` on the spoken words; things are born from a dot or a real UI piece, never pop out of nowhere | `bounce`, `back.out` pops on big cards, `power*.inOut` on anything that starts on a word, chrome arriving while the hero still moves |
| Morph | ONE `.shape` whose real size/radius/position springs per frame (`boxTrack` + `setBox` in `driver`, w 10-11, 6.5-8 for big size changes, leading edge stiffer); content swaps mid-flight (`swapOut` 0.14 s at the start, `swapIn` from +0.1 s); shared faces/text/images travel on their own springs; new chrome builds after the shape lands, top-down. Old `morph()`/`flip()` are legacy: do not use | clip + scale on a fixed box with layers cross-fading (= "slideshow", rejected on every clip until Munnawar Clip 2); 1.3 s morphs; box-on-box; squash |
| Followers | anything riding something else (pin on globe, token on a path, label on a shape, cursor): compute in ONE `driver(fn)` from pure `K()` functions of time | flying to a precomputed spot then starting to follow |
| Exits | `swapOut` (0.14 s, explicit blur(0) start) during a state change; a popped element exits back into its origin (scale 0.4 + fade); a deleted message turns to dust (`makeDust`) after it was readable >= 0.8 s | hard cuts inside graphics; match cuts; exits faster than the reader can read |
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
1. Every state change follows motion.md section 3 (one shape on springs, content swapped mid-flight, shared elements travel, chrome
   after landing, top-down) and passes the morph strip check (motion.md section 7) BEFORE the preview is sent.
2. Camera keys 1.8-2.4 s CAMV; nothing else big moves while the camera moves; peak-zoom framing >= 40 px.
3. Real UI rebuilt with real assets wherever a real product/person is named; English; no inline text scaling.
4. Graphic stays through short host lines and to the last frame; layout changes only on pauses/joins.
5. No cursor gags/crowds/hopping boxes; choices = hesitating photo cursor.
6. `qa.py --render` passes (check, overlaps, near-still <= 15%), one sheet looked at, no motion blur in the render.
7. No own pills/stamps/headers inside a real UI; speech bubbles outside the media, bold blue, tail to the speaker; play buttons
   centred; real people only from the editor's photos/cutouts.
8. Studio: stack opening, captions + logo present, Diksha on screen for her questions, reaction cuts on pauses only.
9. Spacing pass on the sheet (section "Composition and spacing"): centred, padded, nothing under the logo band or the captions.
10. Memoji act (expressions), never lip-sync; Apple emoji and clean icons only; real UI is driven by a cursor (typing, clicks, Send).
11. No blur build-ins on settled cards; no element born from nothing; highlighters after their text.

## SFX (code-generated, separate track)
Soft whooshes on camera moves, gentle pops for arrivals, light ticks for counters/word reveals, one chime for the key number, clicks for cursors.
Peak -9 dBFS, never busy. `tools/sfx.py` + `assets/sfx_cues.json`.

## Editor feedback history (short; details in log/used.md)
- v1 of the series was rejected for tiny/low inset framing, captions, punch-ins, graphics popping in late and leaving abruptly, generic mockups.
- Clip 2: 5 rounds (slideshow motion, box-on-box morphs, pin not riding the globe, zoom pushing cards out, match cut, unasked motion blur).
- Clip 3: 3 rounds (rushed expo camera, cursor crowds, inline-scaled UI text, heavy white "disabled" wash).
- Clip 4: 2 rounds (mixed-timing squash morphs). Loved: MKBHD scrub preview growing into the video tile (one element, one spring).
- Clip 5: 1 round (made-up UI instead of real YouTube Studio/feed, hopping focus box, stack cut, squash crept back). Approved v2.
- Munnawar Clip 2 (studio, this style): v1 "slideshow" morphs again -> rebuilt on the motion engine from the editor's motion
  reference; v2 "really did good, the morphs and animations are better", v3 approved ("it looks great"). See motion.md.
- Munnawar Clip 3: 3 rounds (old kit morphs, blur build-ins, cramped cards, unexplained pill, lip-syncing avatar, intro jitter). KEEP: card -> Loom.
- Munnawar Clip 4: 1 round (animation over the opening, camera-cropped face, made-up résumé vs real LinkedIn, no captions/logo, highlighter early).
- Munnawar Clip 5: 2 rounds (v1 built on Clip 4's old kit = broken morphs + no captions; Windows emoji; made-up Slack/Loom; lip-sync).
  LOVED: photo circle -> checklist. v2 note "reverse it to how it was": never redesign a part nobody noted.
- Loved overall: real-UI storytelling, thumbnail -> circle orbit, one continuous dot-grid scene with calm camera, iOS notification -> Messages,
  feathered blue wipe, confetti + UI shake, Diksha's hesitating photo cursor, morph chains of the same object.

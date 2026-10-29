# Kit API (`tools/kit.js`, inlined by build.py) - updated 2026-10-24 with the approved Clip 3-5 motion

Globals in the page script: `tl` (the one paused timeline), `DATA` ({words, joins, layout, fps}), `DUR` (clip length).
All times are seconds on the **final audio clock**. Do not redefine anything below in the composition (build breaks on redeclare).

## Time
| Helper | Use |
|---|---|
| `T(t)` | snap a time to the 24 fps grid |
| `W("word", n=0, after=0)` | start of the n-th occurrence of a word (case/punct-insensitive). Throws on typos. **Anchor every beat with W().** |

## Eases (locked)
| Name | What | Use with |
|---|---|---|
| `CAMV` | 12% gentle ease-in, cubic ease-out | camera keys (default in `camPath`, 1.8-2.4 s), long travel, fills, K() default |
| `SSP` / `SSD`=1.2 | soft spring ~8% overshoot | arrivals (`landS`) - always `duration: SSD` |
| `MSP` / `MSD`=1.3 | morph spring ~3% overshoot | legacy `morph()` / `flip()` only - new clips use the motion engine below |
| `HEAVY` | wobbly spring, duration 1.4 | balance beams, weights dropping |
| `springD(z, w, D)` | custom time-based spring | always tween with duration D |
| `SOFT` (expo.out), `SMOOTH`, `DRIFT` (sine.inOut ambient only), `GLIDE` (cursor travel only) | | |
| Old names `SPRING`, `BIG`, `SD`, `CAM`, `MORPH` | aliases of SSP, MSP, SSD, CAMV, CAMV | prefer the new names |

## Motion engine (THE way to animate state changes - rules and numbers in `references/motion.md`)
All pure functions of t; geometry is applied inside the ONE `driver()`. Kit block `MOTION ENGINE` (self-checks at load).
| Helper | Use |
|---|---|
| `spring(d, w=11, z=0.72)` | closed-form spring 0 -> 1, d s after a change (~5% overshoot, ~0.5 s). w 11 UI, 6.5-8 big size changes, 4.5 camera |
| `track([[t0,v0],[t,v,w?],...], w, z)` -> f(t) | array value re-targeted many times (sum of one spring per change): cursor, bubble width, HUD width, text travel |
| `boxTrack([[t0,[x,y,w,h,r]],[t,box,w?],...])` -> f(t) | THE morph: a box whose edges ride their own springs (leading edge stiffer = stretch) |
| `setBox(el, box)` | apply a box to a `.shape` (translate + width/height/radius) |
| `fitIn(layer, box, dw, dh)` | scale a fixed-size designed layer (a thumbnail) to the box width, centred; layer = the inner wrapper |
| `swapIn(el, t, d=0.26, y=10)` / `swapOut(el, t, d=0.14)` | content swap with a short blur; `y=null` for driver-positioned elements |
| `swapInAll(els, t, gap=0.045, y)` / `swapOutAll(els, t, gap=0.02)` | staggered chrome build / clear |
| `wrapWords(el)` + `wordsLand(sel, times)` | words land on speech (throws if word and time counts differ); hand-written `.w` spans for coloured words |
| `seq("spoken phrase", after)` | word start times for a phrase, skipping spoken words that are not shown |
| `camSpring(cam, [[t,[cx,cy,zoom],w?],...], {w:4.5, z:0.92, shakes:[[t,amp]]})` -> f(t) | spring camera (call f(t) in the driver) + decaying shake hits |
| `press(svgSel, t)` | cursor press (scale 0.8 -> 1) at a click |
| `makeDust(canvas, rects, t0, {top, ...})` -> `{draw(t), clip(t)}` | Telegram-style delete: particles + the row's left -> right clip |

Template CSS: `.shape` (the morphing box), `.hl` (a full-size content layer inside it, `img.hl` = cover), `.w` (a word).
```js
const q = (s) => document.querySelector(s);
const heroBox = boxTrack([[0, [104, 246, 300, 60, 14]], [W("six"), [104, 246, 448, 252, 12], 10], [W("youtube"), [90, 100, 680, 383, 16], 8.5]]);
swapOut("#h-file", W("six")); swapIn("#h-thumb", W("six") + 0.1, 0.22, null);                        // content swaps mid-flight
swapOutAll(["#slack-head", "#composer"], W("youtube")); swapInAll(["#yt-title", "#yt-row"], W("youtube") + 0.55);   // chrome after landing
const cam = camSpring("#cam", [[0, [540, 480, 1]], [W("youtube"), [540, 470, 1.03]]], { shakes: [[W("bias"), 15]] });
driver((t) => { const h = heroBox(t); setBox(q("#hero"), h); fitIn(q("#h-thumbS"), h, 448, 252); cam(t); });
```

## Motion helpers
| Helper | Use |
|---|---|
| `landS(el, t, from={opacity:0,scale:0.7,y:24})` (`land` = alias) | THE arrival. Any from-props settle to 1 / 0 / blur(0) |
| `softIn(el, t, d=0.6, y=14)` / `fadeOut(el, t, d=0.45)` | content crossfade in a card / exit with blur |
| `morph(el, t, from, to)` | LEGACY (clip + scale, read as "slideshow"): use `boxTrack` + `setBox` |
| `flip(el, t, to, from={x:0,y:0,scale:1})` | LEGACY: shared elements travel with `track`/`boxTrack` in the driver |
| `ins(top, right, bottom, left, radius)` | clip-path inset string that never collapses (use for every clip-path) |
| `camPath(cam, [[t,[cx,cy,s]], [t,[cx,cy,s], d=2.0, ease=CAMV], ...])` | virtual camera on a `.cam` world; logs `CAMPATH` error if a key runs into the next |
| `K([[t0,v0],[t,v,d=0.6,ease=CAMV],...])` | pure function of time; keys can interrupt each other without jumps |
| `driver((t) => {...})` | ONE per clip: runs every frame; put all followers (cursor, pins, shapes from K()) here |
| `place(el,x,y,rot)` / `placeC(el,x,y,scale)` | set transform inside `driver` |
| `hesitate(t, a, b, amp=7)` -> `[dx, dy]` | "not sure" cursor wobble between a and b (add to the cursor position) |
| `lerp`, `clamp`, `bump`, `rng(seed)` | math; deterministic scatter |
| `blurIn` / `blurOut` / `popIn` | older entrances; prefer `landS` / `softIn` / `fadeOut` |
| `splitWords(el)` + `wordsUp(sel, times)` | word-by-word slide-up synced to speech (title typing on the words) |
| `sweep(markEl, t, d)` / `lineSweep(el, t, d)` | blue marker behind single-line / multi-line text |
| `count(el, from, to, t, d, ease, fmt)` | number counter |
| `drawP(path, t, d=0.9, ease=CAMV)` | SVG stroke draw, hidden until it starts (no round-cap dot). `drawPath` = raw version |
| `cursorPath(cur, [[t,x,y],[t,x,y,d],...])`, `click(cur, ripple, t, x, y)` | older cursor helpers; prefer `track` + translate in the driver and `press` |
| `drift(el, t, d, to)` | slow ambient scale creep |
| `breathe(el, a, b)` | continuous small sway (template runs it on `#gfx`) |
| `applyLayouts()` | applies `tools/layout.json` rows (template calls it) |
| `auditOverlaps()` | console errors for same element+property tweens overlapping in time (fails `check`) |
| `squash()` | REMOVED: throws (rejected by the editor twice) |

## Scene skeleton
```html
<section id="s2" class="clip scene" data-start="{{T:8.67}}" data-duration="{{SPAN:8.67:22.21}}" data-track-index="2">
  <div class="cam" id="s2-cam"> … world … </div>
</section>
```
```js
{ const s = W("she", 3);
  camPath("#s2-cam", [[s, [540, 625, 1]], [W("agency"), [540, 900, 1.06]]]);        // 2 s CAMV by default
  landS("#s2-card", s - 0.15);
  // the card becomes the header band: ONE .shape, its box springs; old content blurs out, new blurs in mid-flight
  const cardBox = boxTrack([[0, [60, 300, 960, 640, 32]], [W("price"), [60, 120, 960, 160, 24], 9]]);
  swapOut("#s2-old", W("price")); swapIn("#s2-band", W("price") + 0.12, 0.24, null);
  swapInAll(["#s2-row1", "#s2-row2"], W("price") + 0.55);                                 // the page builds after it lands
  driver((t) => setBox(document.querySelector("#s2-card"), cardBox(t)));                  // one driver per clip: merge followers into it
}
```
Section `data-start`/`data-duration` must match the layout rows (`{{T:x}}`, `{{SPAN:a:b}}`, `{{D}}` placeholders).

## QA / revision tools (project root)
| Command | Does |
|---|---|
| `python -I tools/qa.py` | build + lint + check, filtered to what matters (known template warnings hidden) |
| `python -I tools/qa.py --render --at 3,9.5,17` | + draft render, motion_check, qa_cuts, panel sheet `qa/sheet.jpg` (run in background) |
| `python -I tools/sheet.py <mp4> <t,t,..> [--crop x:y:w:h] [--w 270]` | small contact sheet straight from the render |
| `python -I tools/patch.py <patchfile>` | batch of exact find/replace edits, all anchors asserted, all-or-nothing |
| `python -I tools/motion_check.py <mp4>` / `qa_cuts.py <mp4>` | the individual gates (qa.py runs them) |

## Gotchas
- No `left/top/width/height` GSAP tweens (lint `gsap_non_transform_motion`); per-frame width/height from the driver are fine,
  position goes through translate (`setBox`).
- GSAP and the driver never touch the same property of one element: GSAP on the wrapper, the driver on the inner element.
- `fromTo` applies its from-state at load: elements that must stay hidden until later need `immediateRender: false`
  (`morph`/`flip` already set it).
- CSS `transform` on an element that GSAP also transforms = lint error; set initial transforms in `fromTo` or `driver`.
- Absolute `.mark` inside multi-line inline text only paints first/last line: use `.lines` + `lineSweep`.
- Deliberate overlaps: `data-layout-allow-overlap data-layout-allow-occlusion` on the covered element; deliberate clipping: `data-layout-allow-overflow`.
- Never `width:0` SVG containers: give SVGs real size + viewBox. Odd video dimensions break yuv420p (framing.py keeps crops even).
- Morph overshoot needs spare room: box 30-40 px bigger each side, clip to the final size. Children inside the clip are clipped too.
- Things riding a moving object: compute inside `driver` from the same function of `t` that moves the object.

## Final export commands
```bash
PIN=$(grep -o 'hyperframes@[0-9.]*' package.json | head -1)
npx --yes $PIN render -q delivery --resolution portrait-4k --fps 24 -o renders/ClipN_4K.mp4   # ~15 GB temp: low C: -> TEMP/TMP on D:
ffmpeg -v error -y -i renders/ClipN_4K.mp4 -i assets/voice.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k renders/ClipN_4K_noSFX.mp4   # no -shortest: it drops the last frame
cp assets/sfx_whoosh.wav renders/ClipN_SFX_whooshes.wav && cp assets/sfx_ui.wav renders/ClipN_SFX_ui.wav && cp assets/sfx.wav renders/ClipN_SFX_all.wav
```
Studio renders default to 30 fps: tell the editor to choose 24 fps there.

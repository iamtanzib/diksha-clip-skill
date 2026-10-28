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
| `MSP` / `MSD`=1.3 | morph spring ~3% overshoot | `morph()` / `flip()` - clip + scale + position on the same one |
| `HEAVY` | wobbly spring, duration 1.4 | balance beams, weights dropping |
| `springD(z, w, D)` | custom time-based spring | always tween with duration D |
| `SOFT` (expo.out), `SMOOTH`, `DRIFT` (sine.inOut ambient only), `GLIDE` (cursor travel only) | | |
| Old names `SPRING`, `BIG`, `SD`, `CAM`, `MORPH` | aliases of SSP, MSP, SSD, CAMV, CAMV | prefer the new names |

## Motion helpers
| Helper | Use |
|---|---|
| `landS(el, t, from={opacity:0,scale:0.7,y:24})` (`land` = alias) | THE arrival. Any from-props settle to 1 / 0 / blur(0) |
| `softIn(el, t, d=0.6, y=14)` / `fadeOut(el, t, d=0.45)` | content crossfade in a card / exit with blur |
| `morph(el, t, from, to)` | THE morph: one element, from/to both state x, y, scale, `clipPath: ins(...)`; MSP 1.3 s. Throws if clipPath is missing on one side |
| `flip(el, t, to, from={x:0,y:0,scale:1})` | shared element (title/photo/thumb) travelling with a morph, same spring + start |
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
| `cursorPath(cur, [[t,x,y],[t,x,y,d],...])`, `click(cur, ripple, t, x, y)` | cursor moves and clicks in real-UI scenes |
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
  // the card becomes the header band: one element, one spring; title travels with it; new content fades in after
  morph("#s2-card", W("price"), { x: 0, y: 0, scale: 1, clipPath: ins(0, 0, 0, 0, 32) },
                                { x: 0, y: -260, scale: 0.9, clipPath: ins(40, 40, 520, 40, 24) });
  flip("#s2-title", W("price"), { x: -120, y: -300, scale: 0.8 });
  fadeOut("#s2-old", W("price"));
  softIn("#s2-new", W("price") + 0.3);
}
driver((t) => { /* followers: placeC(cursor, G.x(t) + hesitate(t, a, b)[0], ...) */ });
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
- No `left/top/width/height` tweens (lint `gsap_non_transform_motion`): use x/y/scale/clip-path.
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
npx --yes $PIN render -q delivery -o renders/ClipN.mp4
npx --yes $PIN render -q delivery --resolution portrait-4k --fps 24 -o renders/ClipN_4K.mp4
for f in ClipN ClipN_4K; do ffmpeg -v error -y -i renders/$f.mp4 -i assets/voice.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k renders/${f}_noSFX.mp4; done   # no -shortest: it drops the last frame
cp assets/sfx.wav renders/ClipN_SFX_track.wav
```
Studio renders default to 30 fps: tell the editor to choose 24 fps there.

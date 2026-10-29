# Motion, transitions and morphs - THE rules (both Diksha skills)

Written 2026-10-29 after Munnawar Clip 2: three rounds of "slideshow" morph notes across the series, then v2/v3 were approved
("the morphs and animations are better", "it looks great"). Built from the editor's reference
`E:\Diksha Podcast\Episode 3 Tushar\Raw\DMnmDsC9z0gcgSUX.mp4` (Twitter "motion study": one shape, never cut, button -> loader
-> player -> slider -> toggle -> tabs -> chart -> cmd-K -> toast). Take its motion, never its look (black UI, Geist, motion blur).
Reference build: `D:\Diksha\Podcast 2\Clips\Clip 2\videos\clip2\tools\index.src.html` (anchors: `shape A`, `shape B`, `per-frame geometry`,
`the deleted message`, `speech bubble`). Helpers: the kit's MOTION ENGINE block (kit-api.md, "Motion engine").

## 1. What a morph IS (the editor's definition)
"A shape seamlessly changing its shape, colour and other properties to adapt to another thing, with smooth animation in between."
So:
- ONE element (`.shape`) exists before, during and after. Its real `width`, `height`, `border-radius`, position (and background) change
  every frame from springs (`boxTrack` + `setBox` in `driver`). The corners stay crisp because nothing is scaled.
- Content inside it SWAPS: the old content blurs out fast at the start (`swapOut`, 0.14 s), the new content blurs in once the shape
  is ~40-60% there (`swapIn`, from +0.10-0.16 s, 0.22-0.26 s, staggered 0.04-0.06 s). Images use `img.hl` (object-fit cover) so they
  reflow live as the box changes (a 16:9 player shrinking into a circle avatar). A designed fixed-size layer (a thumbnail) rides
  `fitIn()` so it scales with the shape while it is visible.
- Shared elements TRAVEL instead of being replaced: the same face, the same text, the same image moves to its new place on its own
  spring (crowd Memoji -> message avatar, circle -> Slack rounded square; composer text -> sent message; avatar -> channel avatar).
- What is NOT a morph (every one was rejected): a fixed box clipped + scaled while two layers cross-fade; fading the old card out and
  the new one in; a second box on top; the new UI appearing while the hero is still flying; 1.3 s MSP morphs (too slow = "slideshow").

## 2. Measured numbers (frame by frame on the reference, 60 fps)
| What | Reference | Our setting |
|---|---|---|
| Small change (button -> loader) | ~0.2 s | `spring` w 11-12 |
| Medium change (island 836x220 -> player 972x620) | to target in ~0.25 s, overshoot ~7% w / 3% h at 0.2 s, settled by 0.55 s | w 10-11, z 0.72 (~4-5% overshoot, settles ~0.5 s) |
| Big size change (player 800 px -> 96 px avatar, link card -> thumbnail) | - | w 6.5-8: at w 11 it collapsed in 4 frames and read as a cut |
| Edges | leading edge ahead of the trailing one (stretch) | `boxTrack`: edges with the travel x1.18 stiffness, against it x0.86 |
| Content swap | old content blurs out during the first ~0.1 s, new content blurs in staggered while the shape settles | `swapOut` 0.14 s / `swapIn` 0.26 s, blur 8-10 px |
| Camera | zooms so each state fills the frame, follows the shape | `camSpring` w 4.5 z 0.92 (~1 s), key at the same time as the morph: shape leads, camera follows |
| Something happens on every beat | yes | no gap > 0.8 s without intended motion |

## 3. Choreography of one state change (copy this order)
1. Trigger on the word (`W()`/`seq()`, 0.05-0.15 s early), or by a cursor click (`press`) when the talk is about using the UI.
2. t+0.00: the shape starts (`boxTrack` key). Old chrome around it `swapOutAll` (gap 0.015-0.02). Camera key on the same t.
3. t+0.05-0.10: old content inside the shape `swapOut`.
4. t+0.10-0.16: new content inside the shape `swapIn` (it appears mid-flight, so the eye reads one object changing).
5. AFTER the shape has landed (~t+0.5-0.6 for big changes): the new chrome builds around it, **top-down**, staggered 0.04-0.07 s
   (header -> text on the words -> media -> counters -> action bar). Never build chrome while the hero still travels ("cluttered").
   Chrome landing on a SETTLED layout rises on a soft spring with NO blur: `landS(el, t, {opacity: 0, y: 18, scale: 0.94})`.
   Blur (`swapIn`) is only for content swapping inside a shape that is still moving - the motion hides it. Blur build-ins on a still
   card read as "coming in with a blur just like a slideshow" (Munnawar Clip 3 v2).
6. Leave it: let it settle >= 0.8 s before the next out animation (a sent message that vanished after 0.35 s was "too fast").

## 4. Recipes that were approved (Clip 2)
| Beat | How |
|---|---|
| Thing is born | from a small real UI piece (a Slack file chip 300x60) that opens into the card (448x252), not from nothing |
| Card -> real player | cursor clicks the centred play button (press + YouTube-style pulse), the card grows into the player, Slack chrome blurs out, YouTube title/channel row blur in after |
| Player -> avatar | player shrinks (w 6.5) into the LinkedIn avatar circle, image swaps mid-flight to the person's REAL photo, the post builds under it after it lands |
| Two shapes at once | avatar circle travels to the channel-avatar slot while the link preview opens into the video thumbnail; both swap content mid-flight |
| Crowd member becomes author | one Memoji's box springs from the crowd to the avatar slot (radius 42 -> 12), the others blur out in a wave from it |
| Typed text is sent | words land on the spoken words in the composer; on Enter the same text element travels into the channel (track x, y, scale) |
| Delete / unsend | Telegram dust: `makeDust` + the row's clip sweeping left -> right over 0.65 s, particles drift up-right, ~1 s life; only after the message has been readable >= 0.8 s |
| Same bubble, new words | bubble width springs (500 -> 400), old words `swapOut`, new words `wordsLand` - never a second bubble |
| Speech from a person in media | bubble OUTSIDE the video/thumbnail (above it), bold: blue `#2563eb`, white text, key word yellow `#fde047`, tail pointing at the speaker; pops from the tail tip, exits back into it (scale 0.4 + fade, no blur) |
| Impact word | one camera shake (`camSpring` shakes, 15 px, 0.7 s decay) after a camera push; pull out before the next morph starts |
| Counters / meters | trust HUD outside the real UI card (top-left), width springs to reveal a tag ("Bias") |

## 4b. Approved in Munnawar Clips 3-5 (editor KEEP / "love this") - reuse the pattern, not the content
| Beat | How | Source anchor |
|---|---|---|
| Born from a dot | avatar dot springs up into a circle, then stretches right into the name pill while the name slides in (never pops in from nothing) | Clip 3 `shape A` |
| Card -> real app being recorded (KEEP) | the job card opens into the Clay app inside a Loom recording; the card's progress bar becomes Loom's dark control bar; cam bubble lands bottom-left | Clip 3 `4. (approved)` |
| Photo -> list (LOVED) | the person's photo circle opens (boxTrack, w 6.5-8) into the "My 10 things" checklist; the photo travels to the header; rows build top-down, tick on each spoken item | Clip 5 `intro` |
| Bubble -> stage | Loom cam bubble opens into a stage; the Memoji goes from bust to full body on the same spring | Clip 3 `5. the cam bubble` |
| Bubble -> meeting tile -> avatar | the Memoji bubble becomes his Zoom tile, the meeting chrome builds around it, then the tile becomes his avatar in a new scene | Clip 5 `Zoom` / `New York` |
| Window -> one of many | a Slack window shrinks into one Memoji/dot among hundreds that light up in a wave from it, counter lands | Clip 5 `S2` |
| Focus a subset | camera push onto the items being named ("top 3"), pull out before the next morph | Clip 5 `row 1 -> Slack` |
| Impact line | one camera shake on the clip's impact phrase ("bias", "random backgrounds") - the editor asked for it on two clips: plan one | Clip 2, Clip 4 |

Source files: `D:\Diksha\Podcast 2\Clips\Clip N\videos\clipN\tools\index.src.html` (grep the anchor, read <= 80 lines).

Cursor-driven real UI (the editor wants it to look USED, not like pre-recorded motion graphics):
- Slack: cursor clicks the channel, the message TYPES into the composer on the spoken words, cursor presses Send, the same text travels up
  into the channel, reactions pop after. Never a message appearing from nowhere.
- Loom: dark vertical control bar with a running timer, round cam bubble with the Memoji, cursor clicks buttons on the spoken words
  (Enrich, Run all, a broken Export -> shake + error toast, pen circles it). No Like/Subscribe buttons (that is YouTube, not Loom).
- LinkedIn: rebuild from the editor's screenshot / profile URL with real rows and logos; Diksha's photo cursor hesitates, clicks Easy Apply.

Memoji ACT, they never lip-sync the speaker (rejected 3 times: "they are not there to make a carbon copy"). The real speaker is already on
screen below. Per beat: grin + raised brows, wink, surprised "o", frown, pleading brows, laugh, glance at the thing being talked about,
light head bob; mouth moves only occasionally. Reference rig: Clip 5 `function makeMemo` + `poseMemo(M, t, {sm, open, brow, wink, lx, ly, tilt})`
(drawn SVG of Munnawar; recolour hair/skin/clothes for another guest). Other people: `assets/memoji/*.png` (template).

## 5. Real UI rules that came with it
- A named platform = its real UI (Slack, YouTube watch page / home feed, LinkedIn post) with real assets. Never interrupt real UI with our
  own pills, stamps, "X = definition" headers or labels inside it; our own overlays (trust HUD) live outside the card.
- Real people: ask the editor for photos and cutouts. Never crop faces from the camera files, never remove a background ourselves.
- Play buttons sit in the centre of a video thumbnail (dim the preview slightly), never at the bottom.
- Popovers must not cover the text they belong to; if there is no clean place, leave them out.
- Diksha's thumbnail style: lined-paper background with a faint red margin line, top-left NAME + small role line, huge condensed
  Anton headline (black) + key word in blue on a yellow box, "THE QUEST" bottom-left, the person as a cutout with a white stroke
  (4 stacked `drop-shadow(±6px)` in #fff) + soft shadow, cropped by the bottom edge. Her channel avatar = `Diksha YT logo.jpg`.

## 6. Technical rules (each one cost a render)
- Driver geometry goes through `translate` (`setBox`); lint flags `left/top` motion. Width/height/radius per frame are fine.
- GSAP and the driver never write the same property of the same element: GSAP tweens opacity/filter of a wrapper, the driver moves the
  inner element (`fitIn` layer inside a `.hl`, `#bubW` popped by GSAP while the driver sets `#bub` width).
- `swapOut` starts from an explicit `blur(0px)` (tweening from `none` snapped = "the bubble glitches").
- Stacking: a layer whose text starts inside another element (composer) needs a higher z-index than that element.
- The camera push must keep text out of the caption band (studio y 916-1008): push far enough that lower text drops below the seam,
  or not at all. Re-check at the push's peak AND during the shake.
- Things near the top-right go under the logo (853-1026 x 84-208) whenever the camera zooms: keep that corner of the UI empty.
- JITTER: never place a shared element (photo, name) from the springing box's live size every frame - it inherits the overshoot and
  shakes. Give it its own well-damped spring (z >= 0.9) to a target inside the box's FINAL geometry; no sqrt/step easing (jumps at the
  start). Order nested moves so they never overlap (name drops below the photo before the photo grows). Munnawar Clip 3 v3 -> v4.
- GSAP clip-path tweens freeze in the render and jump at the end (Munnawar Clip 4): never tween `clipPath` for a morph; geometry per frame
  in `driver` only. `ins()` must not emit "0.00px" (GSAP cannot tween it; fixed in the kit - never copy an older kit from a clip folder).
- A highlighter / marker sweep starts only after its text has landed (sweep at the last word's time + ~0.1 s), never before.
- A full sentence on screen builds word by word (`wordsLand` on the spoken words), never appears whole.

## 7. QA: look at every morph before sending (one call, ~1.5K tokens)
```bash
# frames n..n+15, every 2nd frame, top half: one strip per morph (n = morph time * 24, minus 2)
for s in 318 576 815 1021; do ffmpeg -v error -y -i renders/qa.mp4 -vf "select='between(n\,$s\,$((s+15)))*not(mod(n-$s\,2))',crop=1080:960:0:0,scale=240:-1,tile=8x1" -frames:v 1 qa/strip_$s.jpg; done
ffmpeg -v error -y -i qa/strip_318.jpg -i qa/strip_576.jpg -i qa/strip_815.jpg -i qa/strip_1021.jpg -filter_complex vstack=4 qa/strips.jpg
```
(online layout: crop `1080:1260:0:0`). Pass = every strip shows >= 3 in-between frames where the shape is visibly between its two
states with content mid-swap; no frame with an empty card; no new chrome overlapping a still-moving shape; no text under the captions
or the logo. If a big change collapses in < 4 frames, lower its key's w (6.5-8).

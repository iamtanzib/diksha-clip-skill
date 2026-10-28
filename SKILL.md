---
name: diksha-clip
description: 'Build a finished vertical podcast clip for "The Quest with Diksha" in the locked house style (Kallaway-inspired explainer: graphic panel on top, speaker inset below, white theme, #2563EB, DM Sans, concept animations synced to the words). ONLINE episodes only (guest joins remotely, may share a screen); STUDIO episodes (in person) use diksha-clip-stickman instead. Use whenever the editor (Tahjib) brings a new online Diksha podcast clip, mentions "Diksha clip", "Quest with Diksha", or asks to edit a clip "in our style". Covers inputs, conform, storyboard, build, QA, revisions and render, with a strict cost budget.'
---

# Diksha clip

One clip per session. Start a **fresh session per clip**; never continue an old long one.
Target: **v1 approved after at most one round of notes, ~20-25% of a 5-hour window per clip.**

Read, in this order and only when the step needs it (each once; never re-read):
- `references/style.md` - the locked look, motion language and the **first-output checklist**. Always before storyboarding.
- `references/concepts.md` - inventing concept animations + anti-repeat rule. Before storyboarding.
- `log/used.md` - only the newest ~4 clip blocks (`head -45`). Before storyboarding; append after delivery.
- `references/kit-api.md` - the helper API. Before writing scene code. **Do not read `tools/kit.js` itself** (the API doc is enough).

Reference implementations: open ONLY the section you need (`grep -n` the anchor, then `sed -n a,b p` of <= 80 lines); never cat a whole file.
- Clip 5 `E:\Diksha Nastia Podcast\Clips\Clip 5\videos\clip5\tools\index.src.html` (approved after 1 round - the best template):
  `S1: YouTube Studio upload` (real Studio dialog: stepper, title field typing on words, upload %, schedule date flip; then dialog ->
  home-feed tile morph + rebuilt YouTube home feed), `camera: few, long, calm moves`, `per-frame geometry` (one `drawAll(t)` driver:
  hesitating photo cursor, stairs -> slider path morph, knob-sized circle -> pyramid base on one spring), `S4: audience pyramid`.
- Clip 4 `E:\Diksha Nastia Podcast\Clips\Clip 4\Claude\clip4\tools\index.src.html`: `beat 2: the viewfinder becomes the search bar`,
  `the same card opens into the full channel page` (dropdown -> header -> page), `their first video: a scrub preview` (the MKBHD morph the
  editor loved), `the tag opens into a checkout sheet`, `background dots: one field that bends into the valley`.
- Clip 3 `E:\Diksha Nastia Podcast\Clips\Clip 3\Claude\videos\clip3\tools\index.src.html`: `shared builders` (YouTube tiles / Up next), `S2: Sabrina`.
- Clip 2 `E:\Diksha Nastia Podcast\Clips\Clip 2\videos\clip2\tools\index.src.html`: `function ytPage` (channel page), `drawGlobe`
  (d3 globe + pin riding the spin), `D2: notification` (iOS notification -> Messages), `paintMask` (feathered radial wipe), `confetti`.
  Its motion constants are OUTDATED (expo camera, squash): take structure only, motion from the kit.
Copy the pattern, change the content. The motion helpers (CAMV, springD, SSP, MSP, landS, softIn, fadeOut, K, driver, place/placeC,
lerp/clamp, DUR) are now IN the kit: never paste a helper block from an old clip (redeclaring them breaks the build).

Do NOT load the HyperFrames skills/docs or re-research Kallaway. Load `hyperframes-core` only if a lint/check error is unclear.

## Inputs (ask once if anything is missing)
The editor provides, in the clip folder's `Inputs/`:
- one camera file per person, synced, usually 4K 16:9 (host = Diksha, guest), sometimes a screen recording
- the **final edited audio** (mp3/wav) and its **word-level transcript JSON** (`srijon-word-transcript-v1`: segments[].words[] with start/end)
- the original camera audio is used only for alignment.
- a screen recording is reference material only: rebuild that UI in HTML with real assets (never zoom the recording).
- motion references: default to the editor's set (already analysed; numbers live in style.md). New references: measure them frame by
  frame (object size per frame, motion-energy curve) BEFORE building.
Ask only: who speaks which lines if unclear, whether a screen share appears (and when), and must-have visuals. Brand is fixed.

## Workflow
1. **Scaffold** (one Bash call):
   ```bash
   npx hyperframes init "videos/clipN" --non-interactive --example=blank --skill=general-video && cp -r ~/.claude/skills/diksha-clip/template/* "videos/clipN/"
   ```
   (The template's short CLAUDE.md/AGENTS.md replace the generic HyperFrames ones on purpose.) Fill `project.json`.
2. **Align + conform** (chain with `&&`, read only the summary lines):
   - `python -I tools/align_audio.py && python -I tools/framing.py grid` - every chunk ncc >= 0.9 (a low score = patched word: tell the
     editor where); then view the ONE grid image, read hair/chin/face-x per person.
   - `python -I tools/framing.py suggest --cam guest ... && python -I tools/framing.py suggest --cam host ...`, paste crops, `python -I tools/conform.py`.
   - Framing check image for the editor only for a new guest or studio setup.
3. **Real assets** (only if a real product/person appears): ONE script call that fetches everything (yt-dlp `--flat-playlist -J` /
   `--dump-json` for titles + views, curl `i.ytimg.com/vi/<id>/hqdefault.jpg|maxresdefault.jpg`, avatar/banner) into `assets/yt/` and prints
   one line per asset. No browsing pages for it.
4. **Storyboard (text only)**: ONE markdown table:
   `# · time · spoken line · layout · inset (who) · graphic + motion (word -> action) · transition into next · SFX`.
   Mark new devices ★, name every morph chain (A -> B -> C), list speaker turns and open questions. Check it against the
   first-output checklist in style.md before sending. Get approval before building. This table is the plan: do the design thinking
   here, once; the build follows it without re-deliberating.
5. **Build**: write `tools/index.src.html` (scene markup + scene code only; kit + template supply helpers, bg, inset, stack) and
   `tools/layout.json` in ONE Write each. Anchor every time with `W()`. Morphs: `morph()` + `flip()`; arrivals `landS`; camera
   `camPath` with 2 s CAMV keys; followers in one `driver()`.
6. **QA (all text gates pass BEFORE any picture)**:
   - `python -I tools/qa.py` - build + lint + check (incl. tween overlaps, camPath overlaps). Fix until it prints no FAIL.
   - `python -I tools/qa.py --render --at <6-8 key times>` **in the background** (you are notified; never poll): draft render,
     motion_check (near-still <= 15%), qa_cuts, and ONE panel sheet `qa/sheet.jpg` (~0.9K tokens). Look at the sheet once.
   - Detail only for a flagged spot: `python -I tools/sheet.py renders/qa.mp4 <t> --crop x:y:w:h --w 540`.
   - Never Read full-size frames, 4K frames or the hyperframes snapshot contact sheet (~3K tokens each, they stay in context forever).
7. **Preview**: send the 24 fps draft MP4 (SendUserFile), not Studio playback. Ask for ALL notes in one message.
8. **Revise** with batched notes: ONE patch file (`python -I tools/patch.py qa/roundN.patch`, every anchor asserted), then
   `qa.py --render --at <only the changed moments>`. **Never rewrite the whole composition after v1.**
9. **Render final** (24 fps, never motion blur). Ask which deliverables; Clip 2/5 finals were 4K noSFX + separate SFX wav.
   Remux audio WITHOUT `-shortest`; commands in `references/kit-api.md`. Run renders in the background.
10. **Log**: append the clip's concepts (5-8 lines) to `log/used.md`, newest first.

## Cost discipline (mandatory - measured on Clips 3-5, see `tools/usage.py`)
Where a clip's cost really goes: **~60% is re-reading the context on every call** (avg context 250-300K tokens x 85-150 calls),
~20% output (more than half of it thinking), ~15% cache writes. So:
- **Fewer calls.** Every tool call re-reads the whole context (~25K token-units at mid-session size). Chain shell steps with `&&`,
  send independent calls in parallel in one message, use `qa.py` (one call for ~8 steps) and `patch.py` (one call per round).
- **Small context.** Everything you read or write stays in context to the end. Keep tool output short (`| tail -5`, `cut -c1-160`),
  read files by section, one small sheet per pass, never re-read a file you just wrote, never Write the full composition twice.
- **Fewer rounds.** A revision round re-runs ~30 calls at the largest context of the session. Building to the first-output checklist
  is the biggest saving.
- **Decide once.** Design thinking goes into the storyboard table; build and patch rounds implement it.
- No research, no registry browsing, no doc reading unless a step fails. If notes are vague, ask one precise question.
- After delivery, run `python -I ~/.claude/skills/diksha-clip/tools/usage.py` and add its one-line total to the clip's log entry.

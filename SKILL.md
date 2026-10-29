---
name: diksha-clip
description: 'Build a finished vertical podcast clip for "The Quest with Diksha" in the locked house style (Kallaway-inspired explainer, white theme, #2563EB, DM Sans, real-UI concept animations synced to the words, one-shape spring morphs). ONLINE episodes (guest remote, may share a screen: graphic panel on top, speaker inset below) AND STUDIO episodes (in person: 50/50 half layout - animation top, camera bottom, captions + logo). Use whenever the editor (Tahjib) brings a Diksha podcast clip, mentions "Diksha clip", "Quest with Diksha", or asks to edit a clip "in our style" / "casual style". Use diksha-clip-stickman ONLY when the editor explicitly asks for the stickman style. Covers inputs, conform, build, QA, revisions and render, with a strict cost budget.'
---

# Diksha clip

**Cost plan (measured on Munnawar Clips 2-5, see the bottom section): one session per PHASE, not per clip.**
- Session 1 (`/diksha-clip <clip folder>`): inputs -> build -> v1 preview -> write `HANDOFF.md` -> stop.
- Each review round: a NEW session (`/diksha-clip revise <clip folder> <REVIEW.md path>`) - read HANDOFF.md + REVIEW.md, patch, preview, update HANDOFF.md.
- Final: a NEW session (`/diksha-clip final <clip folder>`) or the editor runs the two commands in HANDOFF.md themselves.
Never continue a clip in a session that already holds a build or a previous round.

Read, in this order and only when the step needs it (each once; never re-read):
- `references/style.md` - the locked look, studio rules, spacing rules and the **first-output checklist**. Before planning.
- `references/motion.md` - how every morph, transition and movement is built, approved recipes with source anchors. Before planning and
  again before writing scene code.
- `references/concepts.md` - inventing concept animations + anti-repeat rule. Before planning.
- `log/used.md` - only the newest ~4 clip blocks (`head -45`). Before planning; append after delivery.
- `references/kit-api.md` - the helper API. Before writing scene code. **Do not read `tools/kit.js` itself** (the API doc is enough).
Revise/final sessions read only HANDOFF.md, REVIEW.md, and the motion.md/style.md sections the notes touch.

Reference implementations: open ONLY the section you need (`grep -n` the anchor, then `sed -n a,b p` of <= 80 lines); never cat a whole file.
- Munnawar (studio, half layout) `D:\Diksha\Podcast 2\Clips\Clip N\videos\clipN\tools\index.src.html`:
  Clip 5 (newest, approved): `intro` (photo -> checklist, LOVED), `row 1 -> Slack` (cursor types + Send), `Loom`, `Zoom`, `New York`, `S2`,
  `function makeMemo` / `poseMemo` (Memoji with expressions). Clip 3: `shape A` (dot -> pill -> badge), `4. (approved)` (card -> Loom, KEEP),
  `5. the cam bubble` (bubble -> stage). Clip 2 `videos\clip2`: `the deleted message` (Telegram dust), `speech bubble`, `per-frame geometry`.
- Nastia (online, split layout) `E:\Diksha Nastia Podcast\Clips\Clip 5\videos\clip5\tools\index.src.html`: `S1: YouTube Studio upload`,
  `S4: audience pyramid`. Clip 4 `...\Clip 4\Claude\clip4\...`: `their first video: a scrub preview`. Their motion constants are OUTDATED
  (clip + scale morphs): take structure only, motion from motion.md.
Copy the pattern, change the content. Never copy `tools/` or `kit.js` from a clip folder (Clip 5 v1 inherited Clip 4's old kit: broken
morphs, no captions, a whole round lost). The template is always the newest approved kit.

Do NOT load the HyperFrames skills/docs or re-research Kallaway. Load `hyperframes-core` only if a lint/check error is unclear.

## Inputs (ask once if anything is missing)
The editor provides, in the clip folder's `Inputs/`: one camera file per person (synced, usually 4K 16:9, often 25 fps), the **final edited
audio** (always use it, never the camera audio) and its **word-level transcript JSON** (`srijon-word-transcript-v1`), sometimes a screen
recording (reference only: rebuild that UI in HTML) and photos of the people (use those; never crop faces from the footage).
- FIRST call: ffprobe every input (duration, fps, size) in one command. A camera shorter than the audio = broken export: stop and tell the
  editor (Clip 4). Cameras at 25 fps are converted with `fps=24` (conform does it), never re-stamped (Clip 1 drifted out of sync).
- Online or studio? Studio (in person, no screen share) -> `half` layout + stack opening + captions + logo (style.md "Studio episodes").
- "180p preview" in the editor's brief means **1080p**.
Ask only: who speaks which lines if unclear, whether a screen share appears, must-have visuals, and for a real photo of anyone shown.

## Workflow (session 1)
1. **Scaffold** (one Bash call):
   ```bash
   npx hyperframes init "videos/clipN" --non-interactive --example=blank --skill=general-video && cp -r ~/.claude/skills/diksha-clip/template/* "videos/clipN/"
   ```
   (The template's short CLAUDE.md/AGENTS.md replace the generic HyperFrames ones on purpose.) Fill `project.json`. Online clips: delete
   the two `hf-*` cells from index.src.html.
2. **Align + conform** (chain with `&&`, read only the summary lines):
   - `python -I tools/align_audio.py && python -I tools/framing.py grid` - every chunk ncc >= 0.9 (a low score = patched word: tell the
     editor where); then view the ONE grid image, read hair/chin/face-x per person. Same guest + studio as an earlier clip: reuse its crops.
   - `python -I tools/framing.py suggest --cam guest ... && python -I tools/framing.py suggest --cam host ...`, paste crops, `python -I tools/conform.py`.
   - Studio: `python -I tools/captions.py` (add the clip's proper nouns to KEEP_CASE first). Build reads `assets/captions.json`.
3. **Real assets** (only if a real product/person appears): ONE script call that fetches everything (yt-dlp metadata, `i.ytimg.com`
   thumbnails, logos, Apple emoji PNGs by codepoint) into `assets/` and prints one line per asset. No browsing pages for it.
4. **Plan (text only)**: ONE markdown table `# · time · spoken line · layout · bottom-half (who) · graphic + motion (word -> action) ·
   transition into next · SFX`. Mark new devices ★, name every morph chain (A -> B -> C). Run the first-output checklist against it.
   Default: send the editor a 6-10 line concept list (one line per beat) and wait for OK - a rejected concept after the build costs a
   whole round (Clip 5's intro). If the editor said "no storyboard", keep the table as your own plan and build straight on.
   Do the design thinking here, once; the build follows it without re-deliberating.
5. **Build**: write `tools/index.src.html` (scene markup + scene code only; kit + template supply helpers, bg, cells, captions, logo) and
   `tools/layout.json` in ONE Write each. Anchor every time with `W()`/`seq()`. Every state change uses the motion engine as motion.md says
   (`boxTrack`/`setBox` shape, `swapIn` inside moving shapes, `landS` no-blur build on settled cards, shared elements on their own damped
   springs, chrome after landing top-down, `camSpring`); all geometry in one `driver()`. Never `morph()`/`flip()`/clip-path tweens.
6. **QA (all text gates pass BEFORE any picture)**:
   - `python -I tools/qa.py` - build + lint + check (incl. tween overlaps, camPath overlaps). Fix until it prints no FAIL.
   - `python -I tools/qa.py --render --at <6-8 key times>` **in the background** (you are notified; never poll): draft render,
     motion_check (near-still <= 15%), qa_cuts, and ONE panel sheet `qa/sheet.jpg`. Look at the sheet once, with the spacing pass (style.md).
   - **Morph strips** (motion.md section 7): ONE stacked image for all morphs. Fix before sending.
   - Never debug in the browser pane (Clip 5 lost ~0.6M units: 100 MB videos hang it). Render and look at a strip instead.
   - Never Read full-size frames, 4K frames or the hyperframes snapshot contact sheet.
7. **Preview**: 1080x1920 24 fps draft MP4 + a < 30 MB copy for the phone (SendUserFile). Ask for ALL notes in one review.
8. **Handoff**: write `HANDOFF.md` in the project (<= 60 lines): paths, layout rows, one line per scene (anchor, time range, what it
   shows, morph chain), people/asset files used, decisions the editor made, KEEP list. Then tell the editor to start a new session for notes.

## Revise session (`/diksha-clip revise <clip folder> <REVIEW.md>`)
- Read HANDOFF.md and REVIEW.md. Do not Read the review frames unless a note's words are unclear without them; then make ONE small sheet
  of only those frames (`python -I tools/sheet.py` style, 270 px wide).
- Change ONLY what the notes ask. KEEP notes and un-noted parts stay byte-identical ("reverse it to how it was" - Clip 5 v2).
  A note about one morph ("re-read motion.md") applies to every morph in the clip.
- ONE patch file (`python -I tools/patch.py qa/roundN.patch`, every anchor asserted), then `qa.py --render --at <only the changed moments>`
  + morph strips of the changed morphs. Never rewrite the whole composition after v1.
- Preview as in step 7, update HANDOFF.md (round, what changed, new KEEPs), stop.

## Final session (`/diksha-clip final <clip folder>`)
Deliverables unless told otherwise: 4K 24 fps video with voice only (noSFX), SFX whooshes wav, SFX UI wav (pops/ticks/clicks), SFX all wav,
all exactly the clip length from 0:00. Commands in `references/kit-api.md` ("Final export"); run in the background; no `-shortest`; never
motion blur. A 4K render needs ~15 GB temp: if C: has less free, point TEMP/TMP at a D: folder for that command and delete it after.
Then append 5-8 lines to `log/used.md` (newest first, incl. the usage line from `tools/usage.py`). No skill edits in a clip session.

## Cost discipline (mandatory)
Measured on Munnawar Clips 2-5 (avg ~6.2M weighted units per clip, 140-170 calls each):
| Phase | Cost | Why |
|---|---|---|
| v1 build | ~2.0M (30-37%) | 60-75 calls, context grows 74K -> 240K |
| each review round | 1.2-2.7M | ran at 250-460K context: every call re-reads it |
| final render | 0.24-0.63M | 5-12 calls at 300-500K context for what is two commands |
| skill update in the clip session | 1.6M (Clip 2) | at 300-370K context |
| tool output | images were ~90% of the bytes that stayed in context (review frames, sheets, strips) |
So:
- **Phase sessions** (top of this file). A revise session starts at ~110K instead of 250-460K: the biggest single saving.
- **Fewer calls.** Every call re-reads the whole context. Chain shell steps with `&&`, parallel independent calls, `qa.py` (8 steps in one),
  `patch.py` (one per round). No standalone task-list updates.
- **Few images.** <= 3 images per round: one sheet, one stacked strip image, one review-frame sheet only if needed.
- **Small context.** `| tail -5`, `cut -c1-160`, read by section, never re-read a file you just wrote, never Write the full composition twice.
- **Decide once.** Design thinking goes into the plan table; build and patch rounds implement it.
- No research, no registry browsing, no doc reading unless a step fails. If notes are vague, ask one precise question.
- After delivery, run `python -I ~/.claude/skills/diksha-clip/tools/usage.py` and add its one-line total to the clip's log entry.

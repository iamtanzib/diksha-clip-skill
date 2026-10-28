# diksha-clip — Claude Code skill (backup)

The Claude Code skill that builds vertical clips from **online** episodes of *The Quest with Diksha*. Online means the guest joins remotely and may share a screen.

**The look:** a white explainer layout in the Kallaway style. A graphic panel sits on top and the speaker inset below. It uses `#2563EB` blue, DM Sans, and concept animations timed to the words.

> Studio episodes (guest in person) use the sister skill
> [diksha-clip-stickman](https://github.com/iamtanzib/diksha-clip-stickman-skill) instead.

This repo **is** the skill folder, so cloning it puts the exact skill back in place.

---

## Install

```bash
npx skills add https://github.com/iamtanzib/diksha-clip-skill
```

Install the stickman skill too. It reads this skill's `references/kit-api.md`:

```bash
npx skills add https://github.com/iamtanzib/diksha-clip-stickman-skill
```

Restart Claude Code. The skills show up as `diksha-clip` and `diksha-clip-stickman`.

### Needed on a fresh PC

| Need | Install |
|---|---|
| Claude Code | https://claude.com/claude-code |
| Node.js 20+ (for `npx hyperframes`) | `winget install OpenJS.NodeJS.LTS` |
| Python 3.12 + numpy + scipy | `winget install Python.Python.3.12`, then `pip install numpy scipy` |
| FFmpeg on PATH | `winget install Gyan.FFmpeg` |

---

## Back up after you change the skill

Right-click `backup.ps1` → **Run with PowerShell**, or run:

```powershell
powershell -ExecutionPolicy Bypass -File "$HOME\.claude\skills\diksha-clip\backup.ps1"
```

It saves every change, including new `log/used.md` entries, with a dated message and pushes it to GitHub. If nothing changed, it does nothing. It only works from the folder this repo was cloned into: the original editing PC, or a `git clone` of the repo.

**Pull the latest from GitHub** (for example, after editing on another PC):

```powershell
git -C "$HOME\.claude\skills\diksha-clip" pull
```

**Roll back:** every backup is a commit. See the history with `git -C "$HOME\.claude\skills\diksha-clip" log --oneline`.

---

## What's inside

```
SKILL.md              entry point Claude reads: workflow, inputs, cost rules
references/
  style.md            the locked look, motion language, first-output checklist
  concepts.md         how to invent concept animations + anti-repeat rule
  kit-api.md          helper API for scene code (also used by stickman)
log/used.md           concepts used per clip, newest first (anti-repeat memory)
tools/usage.py        token/cost report for a finished session
template/             copied into every new clip project
  project.json        inputs, cameras, crops
  tools/              align_audio, framing, conform, build, qa, qa_cuts,
                      motion_check, sheet, sfx, patch, kit.js, index.src.html
  assets/fonts/       DM Sans + Roboto (SIL Open Font License)
  assets/sfx_cues.json
  CLAUDE.md, AGENTS.md  per-project instructions
```

**How it's used:** start a fresh Claude Code session in the clip folder and say "Diksha clip". The skill sets up a HyperFrames project from `template/`. It then aligns the audio, conforms the cameras, storyboards, builds, runs QA and renders. `SKILL.md` has the full workflow.

---

## Notes

- Line endings are stored as-is (`.gitattributes`), so a clone is byte-for-byte the same as the original.
- `SKILL.md` points to reference clips by absolute paths on the editing PC (`E:\…`, `D:\…`). Those are optional examples. The skill still runs without them.

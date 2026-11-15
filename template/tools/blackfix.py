"""Find black frames in the conformed cameras and freeze the previous good frame over them (Tushar episode: every camera export
had a black frame at 19.875 s plus black tail frames, Clip 5 another at 49.29 s - a single black frame flashes in the final video).

Run from the project root after conform.py (it also works on any list of MP4s):
    python -I tools/blackfix.py                  # every assets/*.mp4 except screen.mp4
    python -I tools/blackfix.py assets/cam.mp4   # given files only
Prints one line per file: "ok" or the frames it froze. Files are rewritten in place (same codec settings as conform.py).
"""
import glob
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from common import FPS  # noqa: E402


def black_frames(f):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", f, "-vf", "blackdetect=d=0.01:pix_th=0.10", "-an", "-f", "null", "-"],
                         capture_output=True, text=True, errors="replace").stderr
    n = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets",
                            "-of", "csv=p=0", f], capture_output=True, text=True).stdout.strip() or 0)
    # a span that runs to EOF reports black_end = the last frame's pts, not its end: treat it as running to the last frame
    end = lambda b: n - 1 if round(b * FPS) >= n - 1 else round(b * FPS) - 1
    spans = [(round(float(a) * FPS), end(float(b))) for a, b in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)]
    return [(a, b) for a, b in spans if b >= a], n


def fix(f):
    spans, n = black_frames(f)
    if not spans:
        return print(f"{f}: ok")
    if any(b - a + 1 > FPS for a, b in spans if a > 0 and b < n - 1):
        return print(f"{f}: BLACK SPAN > 1 s inside the clip {spans} - a real fade or a broken export: tell the editor, not frozen")
    parts, last = [], "0:v"
    for i, (a, b) in enumerate(spans):
        src = a - 1 if a > 0 else b + 1                     # previous good frame, or the next one for a black first frame
        # freezeframes needs two inputs (frames to keep, frame source): split the same stream
        parts.append(f"[{last}]split[p{i}][q{i}];[p{i}][q{i}]freezeframes=first={a}:last={b}:replace={src}[v{i}]")
        last, spans[i] = f"v{i}", (a, b, src)
    tmp = Path(f).with_suffix(".fix.mp4")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", f, "-filter_complex", ";".join(parts), "-map", f"[{last}]",
                    "-map", "0:a?", "-c:a", "copy", "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
                    "-r", str(FPS), "-g", str(FPS), "-movflags", "+faststart", str(tmp)], check=True)
    tmp.replace(f)
    print(f"{f}: froze frames " + ", ".join(f"{a}-{b} <- {s}" for a, b, s in spans))
    return spans


if __name__ == "__main__":
    files = sys.argv[1:] or [p for p in sorted(glob.glob("assets/*.mp4")) if not p.endswith("screen.mp4")]
    for f in files:
        fix(f)

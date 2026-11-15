#!/bin/zsh
# Run a render command while holding one of 2 machine-wide render slots (16 GB RAM: max 2 Chrome renders at once).
# Batch mode: copy to Clips/Work/. Usage (from a clip project root):  zsh ../render_slot.sh <command...>
# Example: zsh ../render_slot.sh python3 tools/qa.py --render --at 3,9.5,17
DIR="${0:A:h}"; LOCKROOT="$DIR/.render_locks"   # locks live next to this script (the batch Work folder)
mkdir -p "$LOCKROOT"
SLOT=""
while [[ -z "$SLOT" ]]; do
  for s in 1 2; do
    if mkdir "$LOCKROOT/slot$s" 2>/dev/null; then
      SLOT=$s; echo "$$ $(pwd)" > "$LOCKROOT/slot$s/owner"; break
    fi
    # stale lock: owner process gone
    if [[ -f "$LOCKROOT/slot$s/owner" ]]; then
      pid=$(cut -d' ' -f1 "$LOCKROOT/slot$s/owner")
      if ! kill -0 "$pid" 2>/dev/null; then rm -f "$LOCKROOT/slot$s/owner"; rmdir "$LOCKROOT/slot$s" 2>/dev/null; fi
    fi
  done
  [[ -z "$SLOT" ]] && sleep 15
done
release() { rm -f "$LOCKROOT/slot$SLOT/owner"; rmdir "$LOCKROOT/slot$SLOT" 2>/dev/null; }
trap release EXIT INT TERM
echo "[render_slot] got slot $SLOT"
export TMPDIR="$DIR/.tmp"; mkdir -p "$TMPDIR"   # render temp on the Work drive, not the full system disk
"$@"

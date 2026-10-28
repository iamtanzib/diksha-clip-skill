// Diksha clip animation kit. Inlined into index.html by tools/build.py.
// Needs: gsap, a paused timeline `tl`, and DATA = {words, joins, layout, fps}.
// Every helper adds tweens to `tl`; times are seconds on the FINAL audio's clock.

const FPS = DATA.fps || 24;
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

// ---------- time ----------
// T(t): snap a final-timeline time to the frame grid.
const T = (t) => Math.round(t * FPS) / FPS;
// W("word", n): start time of the n-th (0-based) occurrence of a word in the final transcript.
// Matching ignores case and punctuation. Throws if missing, so typos fail at build time.
function W(word, n = 0, after = 0) {
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}%]/gu, "");
  const hits = DATA.words.filter((w) => w.s >= after && norm(w.w) === norm(word));
  if (!hits[n]) throw new Error(`word not found: "${word}" #${n} after ${after}s`);
  return T(hits[n].s);
}

// ---------- eases (LOCKED after Clips 2-5; approved first time in Clip 5 v2) ----------
// Fast start, soft tail, never a dead stop. Camera travel is slow and calm (CAMV over 1.8-2.4 s), arrivals use a soft
// spring (SSP, ~8% overshoot), morphs use ONE spring for clip + scale + position (MSP, ~3% overshoot). No squash.
// Never inOut on anything that starts on a spoken beat. Never motion blur.
const SOFT = "expo.out", GLIDE = "power3.inOut", DRIFT = "sine.inOut";
// springD(damping, omega, duration): time-based spring ease; ALWAYS tween it with that same duration.
function springD(z, w, Dur) {
  const wd = w * Math.sqrt(1 - z * z);
  return (p) => { if (p >= 1) return 1; const t = p * Dur; return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t)); };
}
// CAMV: 12% gentle ease-in, then cubic ease-out. Camera moves (1.8-2.4 s) and any long travel. Fixes "rushed / like a cut".
const CAMV = (p) => { const k = 0.12, d = 1 / ((1 - k) ** 2 * (1 + k / 2)), c = (3 * d * (1 - k) ** 2) / (2 * k); return p < k ? c * p * p : 1 - d * (1 - p) ** 3; };
const SMOOTH = (p) => p * p * (3 - 2 * p);
const SSD = 1.2, SSP = springD(0.62, 9.0, SSD);   // arrivals: cards, pills, rows, icons (~8% overshoot, settles ~1 s)
const MSD = 1.3, MSP = springD(0.74, 7.0, MSD);   // morphs + shared-element travel: ONE ease for shape, scale, position
const HEAVY = springD(0.42, 7.5, 1.4);            // heavy wobble (balance beam, weights), duration 1.4
// Old names kept so copied snippets still run; they now point at the approved values.
const SD = SSD, SPRING = SSP, BIG = MSP, CAM = CAMV, MORPH = CAMV;
const DUR = parseFloat(document.querySelector("#root").dataset.duration);
const lerp = (a, b, p) => a + (b - a) * p, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), bump = (x) => Math.exp(-x * x);

// ---------- layouts ----------
// Rows from tools/layout.json: [time, "split"|"stack"|"full"|"screen", camera]
function applyLayouts(rows = DATA.layout) {
  rows.forEach(([t0, type, cam]) => {
    const t = T(t0);
    const on = (sel, v) => { if ($(sel)) tl.set(sel, { opacity: v ? 1 : 0 }, t); };
    on("#gfx", type === "split");
    on("#screen", type === "screen");
    on("#inset", type === "split" || type === "screen");
    on("#inset-host", cam === "host");
    on("#inset-guest", cam !== "host");
    on("#st-host", type === "stack"); on("#st-guest", type === "stack"); on("#seam", type === "stack");
    on("#full-host", type === "full" && cam === "host");
    on("#full-guest", type === "full" && cam !== "host");
  });
}

// ---------- entrances / exits ----------
function blurIn(el, t, d = 0.7, y = 24) {
  tl.fromTo(el, { opacity: 0, y, filter: "blur(14px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: d, ease: SOFT }, t);
}
function blurOut(el, t, d = 0.4, y = -16) {
  tl.to(el, { opacity: 0, y, filter: "blur(12px)", duration: d, ease: "power2.in" }, t);
}
function popIn(el, t, from = 0.82, d = 0.6) {
  tl.fromTo(el, { opacity: 0, scale: from, filter: "blur(8px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: d, ease: "back.out(1.6)" }, t);
}
// Words of an element (each wrapped in <span class="tw">) slide up at given times.
function wordsUp(sel, times, d = 0.4) {
  $$(sel + " .tw").forEach((w, i) => {
    w.style.display = "inline-block";
    tl.fromTo(w, { opacity: 0, y: 22, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: d, ease: SOFT }, times[i] - 0.04);
  });
}
// Wrap text into <span class="tw"> words (call at setup, before wordsUp).
function splitWords(el) {
  el = typeof el === "string" ? $(el) : el;
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="tw">${w}</span>`).join(" ");
}

// ---------- highlights ----------
// .mark element (absolute, behind single-line text): marker sweeps open.
function sweep(el, t, d = 0.55) {
  tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: d, ease: "power2.inOut" }, t);
}
// .lines span (multi-line text): per-line background sweeps open.
function lineSweep(el, t, d = 0.6) {
  tl.fromTo(el, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: d, ease: "power2.inOut" }, t);
}

// ---------- numbers ----------
function count(el, from, to, t, d, ease = "power2.out", fmt = (v) => Math.round(v).toLocaleString("en-US")) {
  el = typeof el === "string" ? $(el) : el;
  const o = { v: from };
  el.textContent = fmt(from);
  tl.to(o, { v: to, duration: d, ease, onUpdate: () => (el.textContent = fmt(o.v)) }, t);
}

// ---------- SVG ----------
function drawPath(el, t, d = 0.9, ease = "power2.inOut") {
  el = typeof el === "string" ? $(el) : el;
  const len = el.getTotalLength();
  el.style.strokeDasharray = len;
  tl.fromTo(el, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: d, ease }, t);
}
// Same, but hidden until the draw starts (round caps otherwise show a dot before the line draws).
function drawP(el, t, d = 0.9, ease = CAMV) {
  el = typeof el === "string" ? $(el) : el;
  el.style.opacity = 0;
  tl.set(el, { opacity: 1 }, t);
  drawPath(el, t, d, ease);
}

// ---------- virtual camera ----------
// A .cam element (transform-origin 0 0) holds a "world"; pose [cx, cy, s] shows world point
// (cx, cy) at the centre of the graphics area at zoom s. Focal point travels in a straight line.
const VCX = 540, VCY = 625;
const camPose = ([cx, cy, s]) => ({ x: VCX - s * cx, y: VCY - s * cy, scale: s });
// keys: [time, pose, duration = 2.0, ease = CAMV]; the first key is the starting pose. Keys must not overlap.
// House pace: few, long, calm moves (1.8-2.4 s); zoom <= 1.08 on full-width UI; never while a strip/list travels.
function camPath(el, keys) {
  tl.set(el, camPose(keys[0][1]), keys[0][0]);
  for (let i = 1; i < keys.length; i++) {
    const [t, pose, d = 2.0, ease = CAMV] = keys[i];
    if (i + 1 < keys.length && t + d > keys[i + 1][0] + 0.01) console.error(`CAMPATH key ${i} (${t.toFixed(2)}+${d}) runs into key ${i + 1} (${keys[i + 1][0].toFixed(2)})`);
    tl.fromTo(el, camPose(keys[i - 1][1]), { ...camPose(pose), duration: d, ease }, t);
  }
}

// ---------- cursor ----------
// pts: [time, x, y, duration] in the cursor's parent coordinates.
function cursorPath(cur, pts) {
  const [t0, x0, y0] = pts[0];
  tl.fromTo(cur, { x: x0, y: y0, opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power1.out", immediateRender: false }, t0);
  for (let i = 1; i < pts.length; i++) {
    const [t, x, y, d] = pts[i];
    tl.fromTo(cur, { x: pts[i - 1][1], y: pts[i - 1][2] }, { x, y, duration: d, ease: GLIDE, immediateRender: false }, t);
  }
}
function click(cur, rip, t, x, y) {
  tl.to(cur, { scale: 0.82, duration: 0.09, ease: "power2.out" }, t);
  tl.to(cur, { scale: 1, duration: 0.18, ease: "power2.out" }, t + 0.09);
  tl.fromTo(rip, { left: x, top: y, scale: 0.3, opacity: 0.9 }, { scale: 1.4, opacity: 0, duration: 0.55, ease: "power2.out", immediateRender: false }, t);
}

// ---------- ambience ----------
function drift(el, t, d, to = 1.025) {
  tl.fromTo(el, { scale: 1 }, { scale: to, duration: d, ease: "none" }, t);
}
// seeded random for deterministic scatter
function rng(seed = 7) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

// ---------- motion system ----------
// Squash before a morph was REJECTED twice (Clip 4, Clip 5). Kept only so old code fails loudly.
function squash() { throw new Error("squash() is rejected by the editor: use morph() (one element, one spring)"); }

// clip-path inset string that the browser never collapses (all-equal insets get shortened and GSAP mis-pairs them).
function ins(t, r, b, l, R = 0) {
  const v = [t, r + 0.01, b + 0.02, l + 0.03].map((x) => x.toFixed(2) + "px");
  return `inset(${v.join(" ")} round ${Math.max(0, R).toFixed(2)}px)`;
}
// THE house morph (editor loved it in Clip 4/5): ONE element whose clip-path, scale and position run on the SAME
// spring (MSP, 1.3 s). Give the element 30-40 px spare room so the overshoot shows. from/to must both state every
// animated prop (explicit start = no snap on cold seeks). Content inside crossfades in ~0.3 s later (softIn).
function morph(el, t, from, to) {
  if (("clipPath" in to) !== ("clipPath" in from)) throw new Error("morph(): give clipPath in BOTH from and to");
  tl.fromTo(el, from, { ...to, duration: MSD, ease: MSP, immediateRender: false }, t);
}
// Shared element (title, photo, avatar, thumbnail) travelling with a morph: same spring, same start.
function flip(el, t, to, from = { x: 0, y: 0, scale: 1 }) {
  tl.fromTo(el, from, { ...to, duration: MSD, ease: MSP, immediateRender: false }, t);
}
// Arrival with the soft spring. from: any props; they settle to opacity 1 / scale 1 / 0 / blur(0).
function landS(el, t, from = { opacity: 0, scale: 0.7, y: 24 }) {
  const to = { opacity: 1, scale: 1, y: 0, duration: SSD, ease: SSP };
  Object.keys(from).forEach((k) => { if (!(k in to)) to[k] = k === "filter" ? "blur(0px)" : 0; });
  tl.fromTo(el, from, to, t);
}
const land = landS;
function softIn(el, t, d = 0.6, y = 14) { tl.fromTo(el, { opacity: 0, y }, { opacity: 1, y: 0, duration: d, ease: SOFT }, t); }
function fadeOut(el, t, d = 0.45) { tl.to(el, { opacity: 0, filter: "blur(10px)", duration: d, ease: "power2.in" }, t); }

// ---------- per-frame geometry (seek-safe, for anything that follows something else) ----------
// K([[t0, v0], [t, v, dur = 0.6, ease = CAMV], ...]) -> pure function of time. A key starts from the value at its start,
// so keys may interrupt each other without jumps. Use with driver() for cursors, pins, shapes computed every frame.
function K(keys) {
  const sv = [keys[0][1]];
  const f = (t, upto) => {
    let v = keys[0][1];
    for (let i = 1; i < upto; i++) {
      const [ti, vi, d = 0.6, e = CAMV] = keys[i];
      if (t <= ti) break;
      v = sv[i] + (vi - sv[i]) * e(Math.min(1, (t - ti) / d));
    }
    return v;
  };
  for (let i = 1; i < keys.length; i++) sv[i] = f(keys[i][0], i);
  return (t) => f(t, keys.length);
}
const place = (el, x, y, r = 0) => { el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)`; };
const placeC = (el, x, y, s = 1) => { el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${s.toFixed(4)})`; };
// Call fn(t) every frame for the whole clip (one driver per clip; put all per-frame code in fn).
function driver(fn) {
  const o = { v: 0 };
  tl.fromTo(o, { v: 0 }, { v: 1, duration: DUR, ease: "none", onUpdate() { fn(this.time()); } }, 0);
  fn(0);
}
// Hesitating cursor wobble (Diksha's photo cursor "choosing"): add to the cursor position between a and b.
function hesitate(t, a, b, amp = 7) {
  const env = clamp((t - a) / 0.4, 0, 1) * clamp((b - t) / 0.3, 0, 1);
  return [env * amp * Math.sin(t * 2 * Math.PI * 1.4), env * amp * 0.7 * Math.sin(t * 2 * Math.PI * 1.1 + 1.3)];
}
// Breathing camera: three out-of-phase sine sways so the frame is never dead between beats.
// Amplitude is small on purpose (everything must stay in frame): +-9 px x, +-8 px y, 3% scale.
function breathe(el, a, b) {
  const n = (per) => Math.ceil((b - a) / per);
  tl.fromTo(el, { x: -9 }, { x: 9, duration: 2.9, ease: "sine.inOut", yoyo: true, repeat: n(2.9), transformOrigin: "540px 640px" }, a);
  tl.fromTo(el, { y: 8 }, { y: -8, duration: 2.3, ease: "sine.inOut", yoyo: true, repeat: n(2.3) }, a);
  tl.fromTo(el, { scale: 1 }, { scale: 1.03, duration: 3.7, ease: "sine.inOut", yoyo: true, repeat: n(3.7) }, a);
}
// Overlap audit: two tweens animating the same property of the same element at the same time fight each other
// (the later one wins, then the earlier one snaps back = "broken mid-animation"). Call once after building the
// timeline; problems print as console errors and are listed in window.__overlaps.
function auditOverlaps() {
  const meta = new Set(["ease", "duration", "delay", "repeat", "yoyo", "stagger", "onUpdate", "onComplete", "onStart", "immediateRender", "transformOrigin", "keyframes", "overwrite", "callbackScope",
    "parent", "startAt", "data", "id", "lazy", "paused", "runBackwards", "inherit", "yoyoEase", "repeatDelay", "repeatRefresh", "onUpdateParams", "onCompleteParams", "onReverseComplete", "onRepeat"]);
  const rows = [];
  tl.getChildren(true, true, false).forEach((tw) => {
    const s = tw.startTime(), e = s + tw.totalDuration();
    let props = Object.keys(tw.vars).filter((k) => !meta.has(k));
    if (tw.vars.keyframes) props = Object.keys(tw.vars.keyframes[0] || {}).filter((k) => !meta.has(k));
    if (props.includes("scale")) props.push("scaleX", "scaleY");
    tw.targets().forEach((tg) => props.forEach((p) => rows.push({ id: tg.id || tg.className || "obj", tg, p, s, e })));
  });
  const out = [];
  rows.sort((a, b) => a.s - b.s);
  for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
    const A = rows[i], B = rows[j];
    if (B.s >= A.e - 0.02) break;
    if (A.tg === B.tg && A.p === B.p && A.e - A.s > 0.001 && B.e - B.s > 0.001)
      out.push(`#${A.id} "${A.p}" ${A.s.toFixed(2)}-${A.e.toFixed(2)} overlaps ${B.s.toFixed(2)}-${B.e.toFixed(2)}`);
  }
  window.__overlaps = out;
  out.forEach((m) => console.error("OVERLAP " + m));
  return out;
}

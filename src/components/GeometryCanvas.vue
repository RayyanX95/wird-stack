<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useTheme } from '@/composables';

/**
 * The landing hero's backdrop: a tessellated eight-point star lattice — the
 * khatim, the geometry that covers mosque walls from Córdoba to Isfahan.
 *
 * Why it's drawn rather than shipped as an image: the pattern is *constructed*
 * from a grid, so it tiles any viewport at any density without seams, it
 * re-colors itself from the CSS theme tokens instead of needing a second
 * asset for dark mode, and it can animate — which is the point. A still image
 * would be a third of the code and none of the effect.
 *
 * The motion is one idea, not five: after the pattern draws itself in from the
 * centre, a slow wave of light travels outward through the lattice forever.
 * It reads as breathing. That restraint is deliberate — this sits behind
 * reading copy, and anything busier competes with it.
 */

const props = withDefaults(defineProps<{ density?: number }>(), { density: 96 });

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { resolved } = useTheme();

let ctx: CanvasRenderingContext2D | null = null;
let frameId = 0;
let observer: ResizeObserver | null = null;
let startedAt = 0;

/**
 * Cell geometry, built once per resize — the per-frame loop only varies alpha
 * and stroke colour. Rebuilding two Path2D objects per cell per frame was
 * ~9,000 allocations a second on a full-bleed hero, all of them identical.
 */
let cells: { dist: number; star: Path2D; ring: Path2D }[] = [];
let maxDist = 1;
let width = 0;
let height = 0;

/** Pointer parallax target and its eased current value, in px. */
const pointer = { targetX: 0, targetY: 0, x: 0, y: 0 };

const palette = { accent: '#1f6f5c', line: '#d7dcd0', glow: '31, 111, 92' };

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reads the live theme values off the document rather than hardcoding a second
 * copy of the palette — so a token change in tokens.css moves the canvas too.
 */
function readPalette() {
  const s = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  palette.accent = get('--accent', palette.accent);
  palette.line = get('--border-strong', palette.line);
  palette.glow = get('--accent-rgb', palette.glow);
}

/**
 * Vertices of an n-pointed star: alternating outer and inner radii. With
 * spikes = 8 and inner ≈ 0.41 × outer this is the classic sharp khatim star
 * rather than a soft rosette.
 */
function starPath(cx: number, cy: number, outer: number, spikes = 8, innerRatio = 0.41) {
  const path = new Path2D();
  const step = Math.PI / spikes;
  // Start at -90° so a point sits at the top of every star — the pattern reads
  // as aligned to the grid rather than tilted a few degrees off it.
  let angle = -Math.PI / 2;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : outer * innerRatio;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
    angle += step;
  }
  path.closePath();
  return path;
}

function layout() {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;

  const rect = canvas.getBoundingClientRect();
  // Cap the backing store at 2× — beyond that the extra pixels cost real frame
  // time on a full-bleed hero and are invisible on the kind of screen that has them.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const step = props.density;
  const cols = Math.ceil(width / step) + 2;
  const rows = Math.ceil(height / step) + 2;
  const cx = width / 2;
  const cy = height / 2;

  const outer = step * 0.44;

  cells = [];
  maxDist = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - 0.5) * step;
      const y = (r - 0.5) * step;
      const dist = Math.hypot(x - cx, y - cy);
      maxDist = Math.max(maxDist, dist);

      // The inscribed circle is what turns a field of separate stars into a
      // lattice — it reads as the binding ribbon between them.
      const ring = new Path2D();
      ring.arc(x, y, outer * 0.41, 0, Math.PI * 2);

      cells.push({ dist, star: starPath(x, y, outer), ring });
    }
  }
}

/**
 * Draws one frame. Used for the animation loop and for the single static
 * frame drawn under reduced motion (where no loop is held open).
 */
function requestRedraw() {
  cancelAnimationFrame(frameId);
  if (reducedMotion) startedAt = performance.now() - 3000; // past the reveal
  frameId = requestAnimationFrame(draw);
}

function draw(now: number) {
  if (!ctx) return;
  if (startedAt === 0) startedAt = now;
  const elapsed = now - startedAt;

  // Phase 1: the lattice draws itself in from the centre over ~1.7s.
  // Phase 2 (elapsed beyond that): the light wave loops indefinitely.
  const REVEAL_MS = 1700;
  const reveal = reducedMotion ? 1 : Math.min(1, elapsed / REVEAL_MS);
  // Ease-out so it decelerates into place instead of stopping dead.
  const revealDist = (1 - Math.pow(1 - reveal, 3)) * maxDist * 1.15;

  pointer.x += (pointer.targetX - pointer.x) * 0.06;
  pointer.y += (pointer.targetY - pointer.y) * 0.06;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(pointer.x, pointer.y);
  ctx.lineJoin = 'round';

  const step = props.density;
  const wavePhase = reducedMotion ? 0 : elapsed * 0.0009;

  for (const cell of cells) {
    // Feather the reveal over roughly two cells so the leading edge is a soft
    // front rather than a hard circle sweeping across the pattern.
    const entry = Math.min(1, Math.max(0, (revealDist - cell.dist) / (step * 2)));
    if (entry <= 0) continue;

    // A sine over distance-minus-time is a wave travelling outward: cells at
    // the same radius brighten together, and the ring expands forever.
    const wave = reducedMotion ? 0.5 : (Math.sin(cell.dist / 130 - wavePhase) + 1) / 2;
    const alpha = entry * (0.1 + wave * 0.3);

    const lit = wave > 0.62;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = lit ? palette.accent : palette.line;
    ctx.lineWidth = lit ? 1.15 : 0.8;
    ctx.stroke(cell.star);

    ctx.globalAlpha = alpha * 0.45;
    ctx.lineWidth = 0.7;
    ctx.stroke(cell.ring);
  }

  ctx.restore();
  ctx.globalAlpha = 1;

  // Static frame is enough when the pattern isn't moving — don't hold a rAF
  // loop open just to redraw identical pixels 60 times a second.
  if (reducedMotion && reveal >= 1) return;
  frameId = requestAnimationFrame(draw);
}

function onPointerMove(e: PointerEvent) {
  if (reducedMotion) return;
  // ±10px of drift is enough to feel alive and little enough that it never
  // reads as the background sliding around under the text.
  pointer.targetX = ((e.clientX / window.innerWidth) * 2 - 1) * 10;
  pointer.targetY = ((e.clientY / window.innerHeight) * 2 - 1) * 10;
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  readPalette();
  layout();
  frameId = requestAnimationFrame(draw);

  // Reduced motion draws a single frame, so a resize has to explicitly ask
  // for a new one — there's no loop running to pick the new size up.
  observer = new ResizeObserver(() => {
    layout();
    if (reducedMotion) requestRedraw();
  });
  observer.observe(canvas);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
});

// The palette is sampled once per theme, not per frame — re-sample when the
// user flips it, and restart the loop if reduced motion had let it stop.
watch(resolved, () => {
  readPalette();
  if (reducedMotion) requestRedraw();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId);
  observer?.disconnect();
  window.removeEventListener('pointermove', onPointerMove);
});
</script>

<template>
  <!-- Decorative: it carries no information the copy doesn't, so it's hidden
       from assistive tech rather than described. -->
  <canvas ref="canvasRef" class="geometry-canvas" aria-hidden="true" />
</template>

<style scoped>
.geometry-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  /* Fades the lattice out behind the copy so text always wins the contrast
     fight, no matter which part of the wave is passing through. */
  mask-image: radial-gradient(ellipse 78% 68% at 50% 42%, #000 30%, transparent 78%);
}
</style>

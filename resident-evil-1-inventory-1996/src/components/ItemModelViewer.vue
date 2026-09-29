<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Every item uses this model until real ones exist.
const PLACEHOLDER_MODEL = `${import.meta.env.BASE_URL}models/placeholder.gltf`;
// The preview panel's dark display area, in game pixels. The scene renders at
// this size and is scaled up with the rest of the UI, so it stays pixelated.
const WIDTH = 160;
const HEIGHT = 104;
// The display's dark navy in check-item.gif; it is black while the model is away.
const NAVY = new Color('#000020');
const BLACK = new Color('#000000');
// Tilted away from a flat side view, so the model's top and end show.
const START_TILT = 0.35;
const START_TURN = -0.6;

// Measured from check-item.gif and check-item-in-out.gif: the display stays
// black for a moment, then the model tumbles in from a point; the navy shows
// from halfway. Leaving plays the same in reverse, and then the menu opens.
const PAUSE_SECONDS = 0.35;
const SPIN_SECONDS = 0.85;
// Full turns around each axis while tumbling. Different counts on each axis
// make the tumble look uncontrolled.
const SPIN_TURNS = { x: 1.5, y: 2, z: 1.25 };
const FULL_TURN = 2 * Math.PI;

// Estimated from check-item.gif; the model keeps moving while a control is held.
const ROTATION_SPEED = Math.PI; // radians per second
const ZOOM_SPEED = 1.5; // camera distance per second
// The model starts at the farthest distance; zooming in stops at the nearest.
const FARTHEST = 2.2;
const NEAREST = 1.1;

type Control = 'up' | 'down' | 'left' | 'right' | 'clockwise' | 'counter-clockwise' | 'zoom-in' | 'zoom-out';

const KEY_CONTROLS: Record<string, Control> = {
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
  q: 'clockwise',
  e: 'counter-clockwise',
  z: 'zoom-in',
  c: 'zoom-out',
};

// The red arrows around the model, which can also be held down with the mouse.
const ARROWS = ['up', 'down', 'left', 'right'] as const;

// The camera looks down the Z axis, so these are the screen's axes.
const SCREEN_X = new Vector3(1, 0, 0);
const SCREEN_Y = new Vector3(0, 1, 0);
const SCREEN_Z = new Vector3(0, 0, 1);

// While frozen, such as when the description is shown, the model stays in its
// current position, the controls do nothing and the arrows are hidden.
// `leaving` spins the model out; `left` is emitted once it is gone.
const { frozen = false, leaving = false } = defineProps<{ frozen?: boolean; leaving?: boolean }>();

const emit = defineEmits<{ describe: []; left: [] }>();

type Phase = 'entering' | 'viewing' | 'leaving';
const phase = ref<Phase>('entering');
const isControllable = computed(() => phase.value === 'viewing' && !frozen);

const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
// Reactive, so each arrow lights up while its control is held.
const heldControls = reactive(new Set<Control>());

let renderer: WebGLRenderer | undefined;
let model: Object3D | undefined;
let lastFrameTime: number | undefined;
// Set on the first frame of each phase.
let phaseStartTime: number | undefined;
// The model may still be spinning in when leaving starts.
let leaveStartScale = 1;
let hasLeft = false;

function startPhase(nextPhase: Phase) {
  phase.value = nextPhase;
  phaseStartTime = undefined;
}

function hold(control: Control) {
  heldControls.add(control);
}

function release(control: Control) {
  heldControls.delete(control);
}

function onKeydown(event: KeyboardEvent) {
  if (!isControllable.value) return;
  const key = event.key.toLowerCase();
  if (key === 'k') {
    emit('describe');
    return;
  }
  const control = KEY_CONTROLS[key];
  if (!control) return;
  event.preventDefault();
  hold(control);
}

function onKeyup(event: KeyboardEvent) {
  const control = KEY_CONTROLS[event.key.toLowerCase()];
  if (control) release(control);
}

// A key released while the window is in the background never sends keyup.
function releaseAll() {
  heldControls.clear();
}

watch(isControllable, controllable => {
  if (!controllable) releaseAll();
});

watch(
  () => leaving,
  isLeaving => {
    if (!isLeaving) return;
    leaveStartScale = model?.scale.x ?? 0;
    startPhase('leaving');
  },
);

function enter(model: Object3D, scene: Scene, phaseSeconds: number) {
  const progress = MathUtils.clamp((phaseSeconds - PAUSE_SECONDS) / SPIN_SECONDS, 0, 1);
  // Grows slowly at first, like the recording, and comes to rest at the start angle.
  const turnsLeft = 1 - progress;
  model.visible = progress > 0;
  model.scale.setScalar(progress ** 2);
  model.rotation.set(
    START_TILT + SPIN_TURNS.x * FULL_TURN * turnsLeft,
    START_TURN + SPIN_TURNS.y * FULL_TURN * turnsLeft,
    SPIN_TURNS.z * FULL_TURN * turnsLeft,
  );
  scene.background = progress < 0.5 ? BLACK : NAVY;
  if (progress === 1) startPhase('viewing');
}

function leave(model: Object3D, scene: Scene, phaseSeconds: number, seconds: number) {
  const progress = MathUtils.clamp(phaseSeconds / SPIN_SECONDS, 0, 1);
  // Shrinks quickly at first; tumbles on from wherever the player turned it.
  const angle = (FULL_TURN / SPIN_SECONDS) * seconds;
  model.visible = progress < 1;
  model.scale.setScalar(leaveStartScale * (1 - progress) ** 2);
  model.rotateOnWorldAxis(SCREEN_X, SPIN_TURNS.x * angle);
  model.rotateOnWorldAxis(SCREEN_Y, SPIN_TURNS.y * angle);
  model.rotateOnWorldAxis(SCREEN_Z, SPIN_TURNS.z * angle);
  scene.background = progress < 0.5 ? NAVY : BLACK;
  if (phaseSeconds >= SPIN_SECONDS + PAUSE_SECONDS && !hasLeft) {
    hasLeft = true;
    emit('left');
  }
}

// Turns or zooms the model for each held control, by how long the frame took.
function move(model: Object3D, camera: PerspectiveCamera, seconds: number) {
  const angle = ROTATION_SPEED * seconds;
  // A positive angle turns counter-clockwise when looking down the axis.
  if (heldControls.has('up')) model.rotateOnWorldAxis(SCREEN_X, -angle);
  if (heldControls.has('down')) model.rotateOnWorldAxis(SCREEN_X, angle);
  if (heldControls.has('left')) model.rotateOnWorldAxis(SCREEN_Y, -angle);
  if (heldControls.has('right')) model.rotateOnWorldAxis(SCREEN_Y, angle);
  if (heldControls.has('clockwise')) model.rotateOnWorldAxis(SCREEN_Z, -angle);
  if (heldControls.has('counter-clockwise')) model.rotateOnWorldAxis(SCREEN_Z, angle);

  const distance = ZOOM_SPEED * seconds;
  if (heldControls.has('zoom-in')) camera.position.z = Math.max(camera.position.z - distance, NEAREST);
  if (heldControls.has('zoom-out')) camera.position.z = Math.min(camera.position.z + distance, FARTHEST);
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('keyup', onKeyup);
  window.addEventListener('blur', releaseAll);

  if (!canvas.value) return;
  renderer = new WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(WIDTH, HEIGHT, false);

  const scene = new Scene();
  scene.background = BLACK;
  scene.add(new AmbientLight(0xffffff, 0.3));
  const light = new DirectionalLight(0xffffff, 3);
  light.position.set(-1, 2, 1.5);
  scene.add(light);

  const camera = new PerspectiveCamera(35, WIDTH / HEIGHT, 0.1, 100);
  camera.position.set(0, 0, FARTHEST);

  const gltf = await new GLTFLoader().loadAsync(PLACEHOLDER_MODEL);
  // The viewer may have closed while the model loaded.
  if (!renderer) return;
  const loadedModel = gltf.scene;
  loadedModel.visible = false;
  scene.add(loadedModel);
  model = loadedModel;

  renderer.setAnimationLoop(time => {
    const seconds = lastFrameTime === undefined ? 0 : (time - lastFrameTime) / 1000;
    lastFrameTime = time;
    phaseStartTime ??= time;
    const phaseSeconds = (time - phaseStartTime) / 1000;
    if (phase.value === 'entering') enter(loadedModel, scene, phaseSeconds);
    else if (phase.value === 'leaving') leave(loadedModel, scene, phaseSeconds, seconds);
    else move(loadedModel, camera, seconds);
    renderer?.render(scene, camera);
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('keyup', onKeyup);
  window.removeEventListener('blur', releaseAll);

  model?.traverse(object => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      object.material.dispose();
    }
  });
  renderer?.setAnimationLoop(null);
  renderer?.dispose();
  // Browsers allow only a few WebGL contexts at once, and CHECK opens a new one each time.
  renderer?.forceContextLoss();
  renderer = undefined;
});
</script>

<template>
  <div class="item-model-viewer">
    <canvas ref="canvas" class="item-model-viewer__canvas" aria-label="Item model"></canvas>
    <template v-if="isControllable">
      <!-- mousedown.prevent keeps focus off the arrow, so the next key press
           does not draw a focus outline around it. -->
      <button
        v-for="arrow in ARROWS"
        :key="arrow"
        class="item-model-viewer__arrow"
        :class="[`item-model-viewer__arrow--${arrow}`, { 'item-model-viewer__arrow--lit': heldControls.has(arrow) }]"
        type="button"
        :aria-label="`Rotate ${arrow}`"
        @mousedown.prevent
        @pointerdown="hold(arrow)"
        @pointerup="release(arrow)"
        @pointerleave="release(arrow)"
        @pointercancel="release(arrow)"
      ></button>
    </template>
  </div>
</template>

<style scoped>
/* Inside the preview panel's display: its dark area starts 1 pixel right of
   and 4 pixels below the display's corner. */
.item-model-viewer {
  position: absolute;
  top: calc(4 * var(--game-pixel));
  left: calc(1 * var(--game-pixel));
  width: calc(160 * var(--game-pixel));
  height: calc(104 * var(--game-pixel));
}

.item-model-viewer__canvas {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

/* Each arrow image holds the dark arrow under the bright one. The arrows stay
   dark, and light up while the model turns their way (check-item.gif). */
.item-model-viewer__arrow {
  position: absolute;
  padding: 0;
  border: 0;
  background: 0 100% / 100% 200% no-repeat;
  image-rendering: pixelated;
  cursor: pointer;
}

.item-model-viewer__arrow--lit {
  background-position: 0 0;
}

/* Positions measured from check-item.gif, in the display's game pixels. */
.item-model-viewer__arrow--up {
  top: calc(3 * var(--game-pixel));
  left: calc(77 * var(--game-pixel));
  width: calc(6 * var(--game-pixel));
  height: calc(9 * var(--game-pixel));
  background-image: url('../assets/ui/rotate-arrow-up.png');
}

.item-model-viewer__arrow--down {
  top: calc(94 * var(--game-pixel));
  left: calc(77 * var(--game-pixel));
  width: calc(6 * var(--game-pixel));
  height: calc(9 * var(--game-pixel));
  background-image: url('../assets/ui/rotate-arrow-down.png');
}

.item-model-viewer__arrow--left {
  top: calc(49 * var(--game-pixel));
  left: calc(2 * var(--game-pixel));
  width: calc(9 * var(--game-pixel));
  height: calc(6 * var(--game-pixel));
  background-image: url('../assets/ui/rotate-arrow-left.png');
}

.item-model-viewer__arrow--right {
  top: calc(49 * var(--game-pixel));
  left: calc(150 * var(--game-pixel));
  width: calc(9 * var(--game-pixel));
  height: calc(6 * var(--game-pixel));
  background-image: url('../assets/ui/rotate-arrow-right.png');
}
</style>

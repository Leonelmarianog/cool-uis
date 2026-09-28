<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { AmbientLight, Color, DirectionalLight, Mesh, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import type { Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Every item uses this model until real ones exist.
const PLACEHOLDER_MODEL = `${import.meta.env.BASE_URL}models/placeholder.gltf`;
// The preview panel's dark display area, in game pixels. The scene renders at
// this size and is scaled up with the rest of the UI, so it stays pixelated.
const WIDTH = 160;
const HEIGHT = 104;
// The display's dark navy in check-item.gif.
const BACKGROUND = '#000020';

const canvas = useTemplateRef<HTMLCanvasElement>('canvas');

let renderer: WebGLRenderer | undefined;
let model: Object3D | undefined;

onMounted(async () => {
  if (!canvas.value) return;
  renderer = new WebGLRenderer({ canvas: canvas.value });
  renderer.setSize(WIDTH, HEIGHT, false);

  const scene = new Scene();
  scene.background = new Color(BACKGROUND);
  scene.add(new AmbientLight(0xffffff, 0.3));
  const light = new DirectionalLight(0xffffff, 3);
  light.position.set(-1, 2, 1.5);
  scene.add(light);

  const camera = new PerspectiveCamera(35, WIDTH / HEIGHT, 0.1, 100);
  camera.position.set(0, 0, 2.2);

  const gltf = await new GLTFLoader().loadAsync(PLACEHOLDER_MODEL);
  // The viewer may have closed while the model loaded.
  if (!renderer) return;
  model = gltf.scene;
  // Tilted away from a flat side view, so its top and end show.
  model.rotation.set(0.35, -0.6, 0);
  scene.add(model);
  renderer.render(scene, camera);
});

onUnmounted(() => {
  model?.traverse(object => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      object.material.dispose();
    }
  });
  renderer?.dispose();
  // Browsers allow only a few WebGL contexts at once, and CHECK opens a new one each time.
  renderer?.forceContextLoss();
  renderer = undefined;
});
</script>

<template>
  <canvas ref="canvas" class="item-model-viewer" aria-label="Item model"></canvas>
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
  image-rendering: pixelated;
}
</style>

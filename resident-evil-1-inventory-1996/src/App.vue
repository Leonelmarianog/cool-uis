<script setup>
import ItemPreviewPanel from './components/ItemPreviewPanel.vue'
</script>

<template>
  <main class="project-shell">
    <ItemPreviewPanel class="project-shell__preview-panel" />
  </main>
</template>

<style scoped>
.project-shell {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: var(--space-3);
  min-height: 100svh;
  padding: var(--space-6);
  background: var(--color-preview-background);
}

.project-shell__preview-panel {
  max-width: 864px;
}
</style>

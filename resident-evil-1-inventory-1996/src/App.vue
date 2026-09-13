<script setup>
import ItemPreviewPanel from './components/ItemPreviewPanel.vue'
import CharacterPortraitPanel from './components/CharacterPortraitPanel.vue'
import HealthStatusPanel from './components/HealthStatusPanel.vue'
import EquippedWeaponPanel from './components/EquippedWeaponPanel.vue'
import InventoryGrid from './components/InventoryGrid.vue'
import MenuPanel from './components/MenuPanel.vue'
</script>

<template>
  <main class="project-shell">
    <div class="project-shell__inventory">
      <!-- Keep new components first while building them individually. -->
      <InventoryGrid />
      <MenuPanel />
      <EquippedWeaponPanel />
      <HealthStatusPanel />
      <CharacterPortraitPanel class="project-shell__portrait-panel" />
      <ItemPreviewPanel />
    </div>
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

.project-shell__inventory {
  display: grid;
  gap: 8px;
  width: 100%;
  max-width: 864px;
}

.project-shell__portrait-panel {
  width: 32.407407%;
}
</style>

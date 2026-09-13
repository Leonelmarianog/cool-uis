<script setup>
import ItemPreviewPanel from './components/ItemPreviewPanel.vue'
import CharacterPortraitPanel from './components/CharacterPortraitPanel.vue'
import HealthStatusPanel from './components/HealthStatusPanel.vue'
import EquippedWeaponPanel from './components/EquippedWeaponPanel.vue'
import InventoryGrid from './components/InventoryGrid.vue'
import MenuPanel from './components/MenuPanel.vue'
import ItemDescriptionPanel from './components/ItemDescriptionPanel.vue'
</script>

<template>
  <main class="project-shell">
    <div class="project-shell__inventory">
      <!-- Keep new components first while building them individually. -->
      <ItemDescriptionPanel />
      <InventoryGrid />
      <MenuPanel />
      <EquippedWeaponPanel />
      <HealthStatusPanel />
      <CharacterPortraitPanel />
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
  /* Keep wide panels from expanding the column beyond the container. */
  grid-template-columns: minmax(0, 1fr);
  gap: calc(2 * var(--ui-pixel));
  width: 100%;
  max-width: calc(216 * var(--ui-pixel));
}

</style>

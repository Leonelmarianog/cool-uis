<template>
  <main class="project-shell">
    <h1>Resident Evil 1 Inventory</h1>
    <p>1996 · UI recreation</p>
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
  text-align: center;
}

h1 {
  font-size: var(--font-size-title);
  line-height: var(--line-height-heading);
}

p {
  color: var(--color-text-muted);
}
</style>

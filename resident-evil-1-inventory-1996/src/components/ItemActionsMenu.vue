<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({ weapon: Boolean })
const emit = defineEmits(['cancel'])
const options = computed(() => [props.weapon ? 'EQUIP' : 'USE', 'CHECK', 'COMBN'])
const active = ref(0)
const buttons = ref([])

async function move(index) {
  active.value = (index + options.value.length) % options.value.length
  await nextTick()
  buttons.value[active.value]?.focus()
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('cancel')
  } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    move(event.key === 'Home' ? 0 : event.key === 'End' ? 2 : active.value + (event.key === 'ArrowDown' ? 1 : -1))
  } else if (event.key === 'Tab') {
    event.preventDefault()
    move(active.value + (event.shiftKey ? -1 : 1))
  }
}

onMounted(() => move(0))
</script>

<template>
  <div class="item-actions-menu" role="menu" aria-label="Item actions" @keydown="onKeydown">
    <button
      v-for="(option, index) in options"
      :key="option"
      ref="buttons"
      type="button"
      role="menuitem"
      class="item-actions-menu__option"
      :class="{ 'item-actions-menu__option--selected': active === index }"
      :tabindex="active === index ? 0 : -1"
      @focus="active = index"
      @pointerenter="move(index)"
      @click="move(index)"
    >{{ option }}</button>
  </div>
</template>

<style scoped>
.item-actions-menu {
  position: absolute;
  right: calc(5 * var(--ui-pixel));
  bottom: calc(4 * var(--ui-pixel));
  z-index: 3;
  display: grid;
  gap: calc(5 * var(--ui-pixel));
  width: calc(53 * var(--ui-pixel));
}

.item-actions-menu__option {
  position: relative;
  height: calc(24 * var(--ui-pixel));
  padding: 0;
  border: var(--ui-pixel) solid #35348c;
  border-right-color: #17164b;
  border-bottom-color: #17164b;
  background: linear-gradient(45deg, #080044 0% 72%, #100078 72%);
  box-shadow: inset var(--ui-pixel) var(--ui-pixel) #100078;
  color: #deded1;
  font-family: 'Teko', sans-serif;
  font-size: calc(22 * var(--ui-pixel));
  line-height: 1;
  text-shadow: calc(0.5 * var(--ui-pixel)) calc(0.5 * var(--ui-pixel)) #55544e;
  cursor: pointer;
}

.item-actions-menu__option--selected::after {
  position: absolute;
  inset: calc(-2 * var(--ui-pixel));
  border: var(--ui-pixel) solid #ed0033;
  outline: var(--ui-pixel) solid #790022;
  content: '';
  pointer-events: none;
}
</style>

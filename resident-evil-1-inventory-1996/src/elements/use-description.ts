import { ref } from 'vue';

/** Typed text in the description panel that stands in for the item name, such as CHECK's item description. */
export function useDescription() {
  /** The description's text, or `null` while it is closed. */
  const text = ref<string | null>(null);

  /** Types the text out; it stays until it is closed. */
  function open(descriptionText: string) {
    text.value = descriptionText;
  }

  /** Removes the text, so the item name returns. */
  function close() {
    text.value = null;
  }

  return { text, open, close };
}

export type Description = ReturnType<typeof useDescription>;

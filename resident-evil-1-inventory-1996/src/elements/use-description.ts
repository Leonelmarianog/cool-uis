import { ref } from 'vue';

/** Typed text in the description panel that stands in for the item name, such as CHECK's item description. */
export function useDescription() {
  /** The description's text, or `null` while it is closed. */
  const text = ref<string | null>(null);
  /** Keeps the text after it is typed out; otherwise it goes away by itself. */
  const isKept = ref(false);

  /** Types the text out. */
  function open(descriptionText: string, keep = false) {
    text.value = descriptionText;
    isKept.value = keep;
  }

  /** Removes the text, so the item name returns. */
  function close() {
    text.value = null;
    isKept.value = false;
  }

  return { text, isKept, open, close };
}

export type Description = ReturnType<typeof useDescription>;

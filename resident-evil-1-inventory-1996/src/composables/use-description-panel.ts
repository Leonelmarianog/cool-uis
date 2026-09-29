import { ref } from 'vue';

/** What the description panel shows in place of the item name. */
export function useDescriptionPanel() {
  const message = ref<string | null>(null);
  const choices = ref<string[]>([]);
  const isKept = ref(false);

  /** Types the text out, then the item name returns. */
  function show(text: string) {
    message.value = text;
    choices.value = [];
    isKept.value = false;
  }

  /** Types the question out; it stays until one of the options is clicked. */
  function ask(question: string, options: string[]) {
    message.value = question;
    choices.value = options;
    isKept.value = false;
  }

  /** Types the text out; it stays until it is cleared, like CHECK's description. */
  function describe(text: string) {
    message.value = text;
    choices.value = [];
    isKept.value = true;
  }

  /** Removes the message, so the item name returns. */
  function clear() {
    message.value = null;
    choices.value = [];
    isKept.value = false;
  }

  return { message, choices, isKept, show, ask, describe, clear };
}

export type DescriptionPanel = ReturnType<typeof useDescriptionPanel>;

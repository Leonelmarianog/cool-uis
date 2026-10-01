import { computed, ref } from 'vue';
import type { Direction } from '../types/direction';
import type { PromptChoice } from '../types/prompt-choice';
import { step } from './step';
import { useCursor } from './use-cursor';

/** A question with choices, shown in the description panel. */
export function usePrompt() {
  /** The question, or `null` while the prompt is closed. */
  const question = ref<string | null>(null);
  const choices = ref<PromptChoice[]>([]);
  /** Points at a choice. */
  const cursor = useCursor();

  /** The choice under the choice cursor, or `null` while the prompt is closed. */
  const pointedChoice = computed(() => choices.value[cursor.index.value] ?? null);

  /** Asks the question; the choice cursor starts on the first choice. */
  function open(promptQuestion: string, promptChoices: PromptChoice[]) {
    question.value = promptQuestion;
    choices.value = promptChoices;
    cursor.reset();
  }

  /** Removes the question and its choices. */
  function close() {
    question.value = null;
    choices.value = [];
  }

  /** Moves the choice cursor one choice left or right; the choices form one row. At either end it stays. */
  function move(direction: Direction) {
    cursor.point(step(cursor.index.value, direction, choices.value.length, choices.value.length));
  }

  return { question, choices, cursor, pointedChoice, open, close, move };
}

export type Prompt = ReturnType<typeof usePrompt>;

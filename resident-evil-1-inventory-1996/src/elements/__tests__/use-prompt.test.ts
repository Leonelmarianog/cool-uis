import { describe, expect, test } from 'vitest';
import { PromptChoice } from '../../types/prompt-choice';
import { usePrompt } from '../use-prompt';

describe('open', () => {
  test('asks the prompt question', () => {
    const prompt = usePrompt();

    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);

    expect(prompt.question.value).toBe('Question?');
  });

  test('moves the choice cursor to the first prompt choice', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);
    prompt.cursor.point(1);

    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);

    expect(prompt.pointedChoice.value).toBe(PromptChoice.Yes);
  });
});

describe('close', () => {
  test('removes the prompt question', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);

    prompt.close();

    expect(prompt.question.value).toBeNull();
  });

  test('removes the prompt choices', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);

    prompt.close();

    expect(prompt.choices.value).toEqual([]);
  });
});

describe('pointedChoice', () => {
  test('points at the prompt choice under the choice cursor', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);

    prompt.cursor.point(1);

    expect(prompt.pointedChoice.value).toBe(PromptChoice.No);
  });
});

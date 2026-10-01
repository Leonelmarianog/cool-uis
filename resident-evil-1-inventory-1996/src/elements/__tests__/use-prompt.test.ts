import { describe, expect, test } from 'vitest';
import { Direction } from '../../types/direction';
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

describe('move', () => {
  test('moves the choice cursor right to the next prompt choice', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);

    prompt.move(Direction.Right);

    expect(prompt.pointedChoice.value).toBe(PromptChoice.No);
  });

  test('moves the choice cursor left to the previous prompt choice', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);
    prompt.cursor.point(1);

    prompt.move(Direction.Left);

    expect(prompt.pointedChoice.value).toBe(PromptChoice.Yes);
  });

  test('keeps the choice cursor on the first prompt choice when moving left', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);

    prompt.move(Direction.Left);

    expect(prompt.pointedChoice.value).toBe(PromptChoice.Yes);
  });

  test('keeps the choice cursor on the last prompt choice when moving right', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);
    prompt.cursor.point(1);

    prompt.move(Direction.Right);

    expect(prompt.pointedChoice.value).toBe(PromptChoice.No);
  });

  test('keeps the choice cursor in place when moving down', () => {
    const prompt = usePrompt();
    prompt.open('Question?', [PromptChoice.Yes, PromptChoice.No]);

    prompt.move(Direction.Down);

    expect(prompt.pointedChoice.value).toBe(PromptChoice.Yes);
  });
});

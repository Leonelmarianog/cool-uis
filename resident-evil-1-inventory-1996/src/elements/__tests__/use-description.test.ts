import { describe, expect, test } from 'vitest';
import { useDescription } from '../use-description';

describe('open', () => {
  test('shows the description text', () => {
    const description = useDescription();

    description.open('Text.');

    expect(description.text.value).toBe('Text.');
  });
});

describe('close', () => {
  test('removes the description text', () => {
    const description = useDescription();
    description.open('Text.');

    description.close();

    expect(description.text.value).toBeNull();
  });
});

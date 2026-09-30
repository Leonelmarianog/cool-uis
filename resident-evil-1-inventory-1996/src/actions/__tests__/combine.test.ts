import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { usePlayerStore } from '../../stores/player';
import { ItemType } from '../../types/item';
import { OutcomeKind } from '../../types/outcome';
import { PromptChoice } from '../../types/prompt-choice';
import { combine, mix } from '../combine';

beforeEach(() => {
  vi.stubGlobal('window', {});
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('combine', () => {
  test('does nothing with an empty slot', () => {
    const player = usePlayerStore();
    const clip = { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 } as const;
    player.inventory = [clip];

    const outcome = combine(clip, null);

    expect(outcome).toEqual({ kind: OutcomeKind.Nothing });
  });

  test('does nothing with the item itself', () => {
    const player = usePlayerStore();
    const clip = { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 } as const;
    player.inventory = [clip];

    const outcome = combine(clip, clip);

    expect(outcome).toEqual({ kind: OutcomeKind.Nothing });
  });

  test('finishes the action after a reload', () => {
    const player = usePlayerStore();
    const beretta = { id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 0 } as const;
    const clip = { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 } as const;
    player.inventory = [beretta, clip];

    const outcome = combine(beretta, clip);

    expect(outcome).toEqual({ kind: OutcomeKind.Done });
  });

  test('does nothing with items that do not combine', () => {
    const player = usePlayerStore();
    const clip = { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 } as const;
    const herb = { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable } as const;
    player.inventory = [clip, herb];

    const outcome = combine(clip, herb);

    expect(outcome).toEqual({ kind: OutcomeKind.Nothing });
  });

  test('asks "Will you mix the herbs?" for herbs that mix', () => {
    const player = usePlayerStore();
    const green = { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable } as const;
    const red = { id: 'herb-2', itemId: 'red-herb', type: ItemType.Consumable } as const;
    player.inventory = [green, red];

    const outcome = combine(green, red);

    expect(outcome).toEqual({
      kind: OutcomeKind.Prompt,
      question: 'Will you mix the herbs?',
      choices: [PromptChoice.Yes, PromptChoice.No],
    });
  });

  test('shows "Mixing these does not seem to work." for herbs that do not mix', () => {
    const player = usePlayerStore();
    const red = { id: 'herb-1', itemId: 'red-herb', type: ItemType.Consumable } as const;
    const blue = { id: 'herb-2', itemId: 'blue-herb', type: ItemType.Consumable } as const;
    player.inventory = [red, blue];

    const outcome = combine(red, blue);

    expect(outcome).toEqual({ kind: OutcomeKind.Description, text: 'Mixing these does not seem to work.' });
  });
});

describe('mix', () => {
  test("puts the mixed herbs in the first herb's slot", () => {
    const player = usePlayerStore();
    const green = { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable } as const;
    const red = { id: 'herb-2', itemId: 'red-herb', type: ItemType.Consumable } as const;
    player.inventory = [green, red];

    mix(green, red);

    expect(player.inventory).toEqual([{ id: 'herb-1', itemId: 'mixed-herbs-g-r', type: ItemType.Consumable }]);
  });

  test('finishes the action', () => {
    const player = usePlayerStore();
    const green = { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable } as const;
    const red = { id: 'herb-2', itemId: 'red-herb', type: ItemType.Consumable } as const;
    player.inventory = [green, red];

    const outcome = mix(green, red);

    expect(outcome).toEqual({ kind: OutcomeKind.Done });
  });
});

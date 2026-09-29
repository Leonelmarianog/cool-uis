import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ItemType } from '../../types/item';

beforeEach(() => {
  vi.resetModules();
});

describe('find', () => {
  test('finds the item with the given ID', async () => {
    vi.doMock('../../data/items.json', () => ({
      default: [
        { id: 'first-item-id', type: 'key', name: 'FIRST ITEM NAME', sprite: 'first-item.png' },
        { id: 'second-item-id', type: 'key', name: 'SECOND ITEM NAME', sprite: 'second-item.png' },
      ],
    }));
    const { itemService } = await import('../item-service');

    const item = itemService.find('second-item-id');

    expect(item).toEqual({
      id: 'second-item-id',
      type: ItemType.Key,
      name: 'SECOND ITEM NAME',
      sprite: 'second-item.png',
    });
  });

  test('throws when no item has the given ID', async () => {
    vi.doMock('../../data/items.json', () => ({
      default: [
        { id: 'item-id', type: 'key', name: 'ITEM NAME', sprite: 'item.png' },
      ],
    }));
    const { itemService } = await import('../item-service');

    expect(() => itemService.find('missing-item-id')).toThrow('Unknown item "missing-item-id"');
  });
});

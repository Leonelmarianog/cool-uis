import itemsJson from '../data/items.json';
import { itemMapper } from '../mappers/item-mapper';
import type { Item } from '../types/item';

export const itemService = {
  find(id: string): Item {
    const json = itemsJson.find(json => json.id === id);
    if (!json) throw new Error(`Unknown item "${id}"`);
    return itemMapper.toItem(json);
  },
};

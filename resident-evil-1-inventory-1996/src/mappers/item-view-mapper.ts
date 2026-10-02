import { ItemType } from '../types/item';
import type { Item } from '../types/item';
import type { ItemView } from '../types/item-view';
import type { PlayerItem } from '../types/player';

// URLs of every item image, keyed by the path Vite imported it from.
// `?no-inline` keeps each image a separate file; Vite would otherwise embed
// small images in the JavaScript bundle.
const itemImages = import.meta.glob<string>('../assets/items/**/*.png', {
  eager: true,
  import: 'default',
  query: '?no-inline',
});

function imageUrl(path: string): string {
  const url = itemImages[`../assets/items/${path}`];
  if (!url) throw new Error(`Unknown item image "${path}"`);
  return url;
}

function amountOf(playerItem: PlayerItem): number | undefined {
  if (playerItem.type === ItemType.Weapon) return playerItem.loadedRounds;
  if (playerItem.type === ItemType.Ammunition) return playerItem.amount;
  return undefined;
}

function amountSuffixOf(item: Item): '%' | undefined {
  return item.type === ItemType.Weapon && item.weapon?.fuel ? '%' : undefined;
}

export const itemViewMapper = {
  toItemView(playerItem: PlayerItem, item: Item): ItemView {
    return {
      id: playerItem.id,
      name: item.name,
      type: item.type,
      sprite: imageUrl(item.sprite),
      amount: amountOf(playerItem),
      amountSuffix: amountSuffixOf(item),
    };
  },
};

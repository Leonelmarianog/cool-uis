import { ItemType } from '../types/item';
import type { Item, LoadedRounds } from '../types/item';
import type { ItemView } from '../types/item-view';
import type { PlayerItem } from '../types/player';
import { RoundsColor } from '../types/rounds-color';

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

/** How the weapon shows the rounds it holds, when it has a look per kind of rounds. */
function loadedRoundsOf(playerItem: PlayerItem, item: Item): LoadedRounds | undefined {
  if (playerItem.type !== ItemType.Weapon || item.type !== ItemType.Weapon || !playerItem.loadedAmmunitionId) {
    return undefined;
  }
  return item.weapon?.rounds?.[playerItem.loadedAmmunitionId];
}

export const itemViewMapper = {
  toItemView(playerItem: PlayerItem, item: Item): ItemView {
    const amount = amountOf(playerItem);
    const loadedRounds = loadedRoundsOf(playerItem, item);
    return {
      id: playerItem.id,
      name: item.name,
      type: item.type,
      sprite: imageUrl(item.sprite),
      description: loadedRounds?.description ?? item.description,
      amount,
      amountSuffix: amountSuffixOf(item),
      amountColor: amount === undefined ? undefined : (loadedRounds?.color ?? RoundsColor.Green),
    };
  },
};

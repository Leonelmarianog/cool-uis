import { describe, expect, test } from 'vitest';
import { ItemAction } from '../../types/item-action';
import { useActionMenu } from '../use-action-menu';

describe('open', () => {
  test('shows the action menu options', () => {
    const menu = useActionMenu();

    menu.open([ItemAction.Use, ItemAction.Check]);

    expect(menu.options.value).toEqual([ItemAction.Use, ItemAction.Check]);
  });

  test('moves the option cursor to the first action menu option', () => {
    const menu = useActionMenu();
    menu.open([ItemAction.Use, ItemAction.Check]);
    menu.cursor.point(1);

    menu.open([ItemAction.Use, ItemAction.Check]);

    expect(menu.pointedOption.value).toBe(ItemAction.Use);
  });
});

describe('close', () => {
  test('removes the action menu options', () => {
    const menu = useActionMenu();
    menu.open([ItemAction.Use]);

    menu.close();

    expect(menu.isOpen.value).toBe(false);
  });
});

describe('pointedOption', () => {
  test('points at the action menu option under the option cursor', () => {
    const menu = useActionMenu();
    menu.open([ItemAction.Use, ItemAction.Check]);

    menu.cursor.point(1);

    expect(menu.pointedOption.value).toBe(ItemAction.Check);
  });

  test('points at nothing while the action menu is closed', () => {
    const menu = useActionMenu();

    expect(menu.pointedOption.value).toBeNull();
  });
});

import { describe, expect, test } from 'vitest';
import { Direction } from '../../types/direction';
import { MapFloor } from '../../types/map-floor';
import { useMap } from '../use-map';

describe('open', () => {
  test('shows 1F', () => {
    const map = useMap();
    map.move(Direction.Up);

    map.open();

    expect(map.floor.value).toBe(MapFloor.First);
  });
});

describe('move', () => {
  test('goes up from 1F to 2F', () => {
    const map = useMap();
    map.open();

    map.move(Direction.Up);

    expect(map.floor.value).toBe(MapFloor.Second);
  });

  test('goes down from 2F to 1F', () => {
    const map = useMap();
    map.open();
    map.move(Direction.Up);

    map.move(Direction.Down);

    expect(map.floor.value).toBe(MapFloor.First);
  });

  test('stays on 2F on the up arrow', () => {
    const map = useMap();
    map.open();
    map.move(Direction.Up);

    map.move(Direction.Up);

    expect(map.floor.value).toBe(MapFloor.Second);
  });

  test('stays on 1F on the down arrow', () => {
    const map = useMap();
    map.open();

    map.move(Direction.Down);

    expect(map.floor.value).toBe(MapFloor.First);
  });

  test('keeps the floor on the left arrow', () => {
    const map = useMap();
    map.open();

    map.move(Direction.Left);

    expect(map.floor.value).toBe(MapFloor.First);
  });

  test('keeps the floor on the right arrow', () => {
    const map = useMap();
    map.open();

    map.move(Direction.Right);

    expect(map.floor.value).toBe(MapFloor.First);
  });
});

describe('hasFloorAbove', () => {
  test('shows the up arrow on 1F', () => {
    const map = useMap();

    map.open();

    expect(map.hasFloorAbove.value).toBe(true);
  });

  test('hides the up arrow on 2F', () => {
    const map = useMap();
    map.open();

    map.move(Direction.Up);

    expect(map.hasFloorAbove.value).toBe(false);
  });
});

describe('hasFloorBelow', () => {
  test('hides the down arrow on 1F', () => {
    const map = useMap();

    map.open();

    expect(map.hasFloorBelow.value).toBe(false);
  });

  test('shows the down arrow on 2F', () => {
    const map = useMap();
    map.open();

    map.move(Direction.Up);

    expect(map.hasFloorBelow.value).toBe(true);
  });
});

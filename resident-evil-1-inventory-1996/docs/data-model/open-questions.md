# Data model: open questions

Questions to verify against the original game before the design is final.

1. **Equipped weapon moved to the item box.** Is it unequipped automatically
   (the move also deletes the `player_equipment` row), or is the move blocked
   until the player unequips it?
2. **Taking an item from the box.** Can the player choose any empty inventory
   cell, or only the one after the last item? The data places it at position
   n + 1 either way; the answer only affects the UI animation.
3. **Recipe result position.** Does the result go to the lower position, or to
   the first-selected item's position? After compacting both end at the same
   place; the answer only affects the UI animation.
4. **`fk_` prefix outside the diagram.** Do JSON keys and code also use it
   (`fkSpriteSheetId`), or only the diagram (code keeps `spriteSheetId`)?
5. **Item box size.** How many rows does the item box list have? Is it the same
   for Jill and Chris?
6. **Reordering the box.** Does moving an item up or down swap it with the
   neighboring row (item or No Item), or can it jump to any row?

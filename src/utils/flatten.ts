/*

Converts an Array of Arrays into a single array with elements from all the
contained arrays.

Important: Does not handle Array of Arrays of Arrays (or further nesting)!

## Examples

```
flatten([ [1, 2, 3], [4, 5] ]); // > [1, 2, 3, 4, 5]
```

*/

export default <T>(arrayOfArrays: T[][]): T[] =>
  Array.prototype.concat.apply([], arrayOfArrays);

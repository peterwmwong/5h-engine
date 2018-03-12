/**
 * Creates an array of arrays.  Each array has a length of `size`
 *
 * Example:
 *
 * ```ts
 *  groupOfSize([1, 2, 3, 4], 2);
 *  // [[1, 2], [3, 4]]
 *
 *  groupOfSize([1, 2, 3], 2);
 *  // [[1, 2], [3]]
 * ```
 *
 * @param input An array that will be grouped
 * @param size  Size of each group
 */
const groupOfSize = <T>(input:T[], size:number):T[][] => {
  const arr = new Array((input.length / size) | 0);
  for(let i = 0; i < arr.length;) arr[i] = input.slice(size * i, size * ++i);
  return arr;
}
export default groupOfSize;

const SHUFFLE_ITERATIONS = 1000;
const rand = (maxValue: number): number => (Math.random() * maxValue) | 0;

export default <T>(array: T[]): T[] => {
  const length = array.length;
  for(let i = 0; i < SHUFFLE_ITERATIONS; ++i) {
    const index1 = rand(length);
    const index2 = rand(length);
    const card1 = array[index1];
    const card2 = array[index2];
    array[index1] = card2;
    array[index2] = card1;
  }
  return array;
}

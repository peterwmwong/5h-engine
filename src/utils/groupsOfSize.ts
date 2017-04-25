export default <T>(input:T[], size:number):T[][] => {
  const arr = new Array(input.length / size);
  for(let i = 0; i < arr.length;) arr[i] = input.slice(size * i, size * ++i);
  return arr;
}

import flatten from './flatten';

describe('flatten(array:any[])', () => {
  it('flatten array of arrays', () => {
    expect(flatten([[1, 2], [3, 4, 5], [6, 7]]))
      .toEqual([1, 2, 3, 4, 5, 6, 7]);
  })
});

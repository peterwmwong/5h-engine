import groupsOfSize from './groupsOfSize';

describe('groupsOfSize(array, n)', () => {
  it('create groups of `n` size', () => {
    expect(groupsOfSize([1, 2, 3, 4, 5, 6], 2))
      .toEqual([
        [1, 2],
        [3, 4],
        [5, 6]
      ]);

    expect(groupsOfSize([1, 2, 3, 4, 5, 6], 3))
      .toEqual([
        [1, 2, 3],
        [4, 5, 6]
      ]);
  })
});

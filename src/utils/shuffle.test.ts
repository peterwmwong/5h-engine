import shuffle from './shuffle';

describe('shuffle(array:any[])', () => {
  it('shuffles array', () => {
    expect(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
      .not.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  })
});

import Play, {
  fullHouseRank,
  isFullHouse,
  isStraight,
  isSisters,
  same,
  compareRank
} from './Play';
import Player from './Player';
import Card, { DECK, getCards } from './Card';
import shuffle from './utils/shuffle';

const PLAYER = new Player('test', []);

const BOMB_4_OF_A_KIND = [
  '3 of Hearts',
  '3 of Diamonds',
  '3 of Spades',
  '3 of Clubs'
];

const BOMB_STRAIGHT_FLUSH = [
  '3 of Hearts',
  '4 of Hearts',
  '5 of Hearts',
  '6 of Hearts',
  '7 of Hearts'
];

//
// Custom `toTrump` matcher to verify one set of cards trumps another.
//
// Example:
//
//    expect([/* card ids */]).toTrump([/* card ids*/]);
//
expect.extend({
  toTrump(received, argument) {
    const play1 = new Play(PLAYER, getCards(...argument));
    const play2 = new Play(PLAYER, getCards(...received));
    const pass = play1.isTrumpedBy(play2);
    let message = () => `expected [${received.join(', ')}] ${pass ? 'NOT ' : ''}to trump [${argument.join(', ')}]`;
    return { pass, message };
  }
});

describe('Play', () => {
  describe('compareRank(a, b)', () => {
    it('sorts by rank', () => {
      const sortedRanks = [...DECK].sort(compareRank).map(c => c.rank);
      // Each card is is higher or equal rank to the card before
      expect(
        sortedRanks.every((r, i) => i === 0 || sortedRanks[i - 1] <= r)
      ).toBe(true);
    });
  });

  describe('same(attr, cards)', () => {
    it('returns true if all cards have the same rank', () => {
      expect(
        same('rank', getCards('3 of Hearts'))
      ).toBe(true);

      expect(
        same(
          'rank',
          getCards(
            '5 of Hearts',
            '5 of Spades',
            '5 of Diamonds',
            '5 of Clubs'
          )
        )
      ).toBe(true);
    });

    it('returns false if not all cards have the same rank', () => {
      expect(
        same(
          'rank',
          getCards(
            '5 of Hearts',
            '6 of Hearts'
          )
        )
      ).toBe(false);

      expect(
        same(
          'rank',
          getCards(
            '5 of Hearts',
            '5 of Spades',
            '5 of Diamonds',
            '5 of Clubs',
            '6 of Hearts'
          )
        )
      ).toBe(false);
    });
  });

  describe('isStraight(cards)', () => {
    it('returns true if cards have consecutive rank', () => {
      expect(
        isStraight(
          getCards(
            '3 of Hearts',
            '4 of Clubs',
            '5 of Clubs'
          )
        )
      ).toBe(true);
    });
  });

  describe('isSisters(cards, groupSize)', () => {
    it('returns true if each group is 1) the same rank 2) consecutive', () => {
      expect(
        isSisters(
          getCards(
            '3 of Hearts',
            '3 of Diamonds',

            '4 of Clubs',
            '4 of Spades'
          ),
          2
        )
      ).toBe(true);

      expect(
        isSisters(
          getCards(
            '3 of Hearts',
            '3 of Diamonds',

            '4 of Clubs',
            '4 of Spades',

            '5 of Hearts',
            '5 of Spades'
          ),
          2
        )
      ).toBe(true);

      expect(
        isSisters(
          getCards(
            '3 of Hearts',
            '3 of Diamonds',
            '3 of Clubs',

            '4 of Clubs',
            '4 of Spades',
            '4 of Diamonds'
          ),
          3
        )
      ).toBe(true);
    });

    describe('returns false', () => {
      it('returns false the number of cards is not divisible by `groupSize`', () => {
        expect(
          isSisters(
            getCards(
              '3 of Hearts',
              '3 of Diamonds',

              '4 of Clubs'
            ),
            2
          )
        ).toBe(false);
      });

      it("returns false if a group's cards don't all have the same rank", () => {
        expect(
          isSisters(
            getCards(
              '3 of Hearts',
              '3 of Diamonds',

              '4 of Clubs',
              '5 of Diamonds'
            ),
            2
          )
        ).toBe(false);
      });

      it("returns false if a groups are not consecutive", () => {
        expect(
          isSisters(
            getCards(
              '3 of Hearts',
              '3 of Diamonds',

              '5 of Hearts',
              '5 of Diamonds'
            ),
            2
          )
        ).toBe(false);

        expect(
          isSisters(
            getCards(
              '2 of Hearts',
              '2 of Diamonds',

              '3 of Hearts',
              '3 of Diamonds'
            ),
            2
          )
        ).toBe(false);
      });
    });
  });

  describe('isFullHouse(cards)', () => {
    it('returns true if cards contains a pair and a triple', () => {
      expect(
        isFullHouse(
          getCards(
            '3 of Hearts',
            '3 of Diamonds',

            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds'
          )
        )
      ).toBe(true);

      expect(
        isFullHouse(
          getCards(
            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds',

            '3 of Hearts',
            '3 of Diamonds'
          )
        )
      ).toBe(true);
    });

    it("returns false if otherwise", () => {
      expect(
        isFullHouse(
          getCards(
            '3 of Hearts',
            '4 of Diamonds',
            '5 of Hearts',
            '6 of Hearts',
            '7 of Hearts'
          )
        )
      ).toBe(false);

      expect(
        isFullHouse(
          getCards(
            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds',

            '3 of Hearts',
            '10 of Diamonds'
          )
        )
      ).toBe(false);

      expect(
        isFullHouse(
          getCards(
            '3 of Hearts',
            '5 of Clubs',
            '5 of Diamonds',
            '3 of Diamonds',
            '10 of Hearts',
          )
        )
      ).toBe(false);

      expect(
        isFullHouse(
          getCards(
            '10 of Hearts',
            '3 of Diamonds',

            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds'
          )
        )
      ).toBe(false);

      expect(
        isFullHouse(
          getCards(
            '3 of Hearts',
            '3 of Diamonds',

            '5 of Clubs',
            '5 of Diamonds',
            '10 of Hearts'
          )
        )
      ).toBe(false);
    });
  });

  describe('fullHouseRank(cards)', () => {
    it('returns rank if of the triple', () => {
      expect(
        fullHouseRank(
          getCards(
            '3 of Hearts',
            '3 of Diamonds',

            '5 of Clubs',
            '5 of Hearts',
            '5 of Diamonds'
          )
        )
      ).toBe(getCards('5 of Clubs')[0].rank);

      expect(
        fullHouseRank(
          getCards(
            '3 of Clubs',
            '3 of Hearts',
            '3 of Diamonds',

            '5 of Hearts',
            '5 of Diamonds',
          )
        )
      ).toBe(getCards('3 of Clubs')[0].rank);
    });
  });

  describe('constructor(cards)', () => {
    describe('type', () => {
      const typeMultiple = (...cardNames:string[]):{type:string, multiple:number} => {
        const { multiple, type } = new Play(PLAYER, getCards(...cardNames));
        return { multiple, type };
      }

      const type = (...cardNames:string[]) => {
        const { multiple, type } = typeMultiple(...cardNames);
        expect(multiple).toBe(1);
        return type;
      }

      it('singles', () => {
        expect(type('3 of Clubs')).toBe('SINGLES');
      });

      it('pairs', () => {
        expect(type('3 of Clubs', '3 of Hearts')).toBe('PAIRS');
      });

      it('triples', () => {
        expect(type('3 of Clubs', '3 of Hearts', '3 of Hearts')).toBe('TRIPLES');
      });

      it('bomb', () => {
        expect(
          type('3 of Clubs', '3 of Hearts', '3 of Hearts', '3 of Diamonds')
        ).toBe('BOMB');
      });

      describe('sisters', () => {
        it('pairs', () => {
          expect(
            typeMultiple('3 of Clubs', '3 of Hearts', '4 of Hearts', '4 of Diamonds')
          ).toEqual({ type: 'PAIRS_SISTERS', multiple: 2 });

          expect(
            typeMultiple('4 of Hearts', '4 of Diamonds', '3 of Clubs', '3 of Hearts')
          ).toEqual({ type: 'PAIRS_SISTERS', multiple: 2 });

          expect(
            typeMultiple(
              '3 of Clubs',
              '3 of Hearts',

              '4 of Hearts',
              '4 of Diamonds',

              '5 of Hearts',
              '5 of Diamonds'
            )
          ).toEqual({ type: 'PAIRS_SISTERS', multiple: 3 });

          expect(
            typeMultiple(
              '3 of Clubs',
              '3 of Hearts',

              '4 of Hearts',
              '4 of Diamonds',

              '5 of Hearts',
              '5 of Diamonds',

              '6 of Spades',
              '6 of Clubs'
            )
          ).toEqual({ type: 'PAIRS_SISTERS', multiple: 4 });

          // Same as previous, shuffling cards to verify detection is not order
          // dependent
          expect(
            typeMultiple(
              ...shuffle([
                '3 of Clubs',
                '3 of Hearts',

                '4 of Hearts',
                '4 of Diamonds',

                '5 of Hearts',
                '5 of Diamonds',

                '6 of Spades',
                '6 of Clubs'
              ])
            )
          ).toEqual({ type: 'PAIRS_SISTERS', multiple: 4 });
        });

        it('triples', () => {
          expect(
            typeMultiple(
              '3 of Clubs',
              '3 of Hearts',
              '3 of Spades',

              '4 of Hearts',
              '4 of Diamonds',
              '4 of Clubs',
            )
          ).toEqual({ type: 'TRIPLES_SISTERS', multiple: 2 });
        });
      });

      it('straight flush', () => {
        expect(
          type('3 of Clubs', '4 of Clubs', '5 of Clubs', '6 of Clubs', '7 of Clubs')
        ).toBe('STRAIGHT_FLUSH');

        expect(
          type('10 of Clubs', 'Jack of Clubs', 'Queen of Clubs', 'King of Clubs', 'Ace of Clubs')
        ).toBe('STRAIGHT_FLUSH');
      });

      it('full house', () => {
        expect(
          type('3 of Clubs', '3 of Hearts', '5 of Clubs', '5 of Diamonds', '5 of Spades')
        ).toBe('FULL_HOUSE');

        expect(
          type('Jack of Clubs', 'Jack of Hearts', 'Jack of Spades', '5 of Diamonds', '5 of Spades')
        ).toBe('FULL_HOUSE');
      });

      it('straight', () => {
        expect(
          typeMultiple(
            '3 of Diamonds',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs'
          )
        ).toEqual({ type: 'STRAIGHT', multiple: 5 });

        expect(
          typeMultiple(
            '3 of Diamonds',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs',
            '8 of Clubs'
          )
        ).toEqual({ type: 'STRAIGHT', multiple: 6 });

        expect(
          typeMultiple(
            '3 of Diamonds',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs',
            '8 of Clubs',
            '9 of Clubs'
          )
        ).toEqual({ type: 'STRAIGHT', multiple: 7 });

        expect(
          typeMultiple(
            '3 of Diamonds',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs',
            '8 of Clubs',
            '9 of Clubs',
            '10 of Clubs',
            'Jack of Clubs',
            'Queen of Clubs',
            'King of Clubs',
            'Ace of Clubs'
          )
        ).toEqual({ type: 'STRAIGHT', multiple: 12 });

        expect(
          typeMultiple(
            '3 of Clubs',
            '4 of Clubs',
            '5 of Clubs',
            '6 of Clubs',
            '7 of Clubs',
            '8 of Clubs',
            '9 of Clubs',
            '10 of Clubs',
            'Jack of Clubs',
            'Queen of Clubs',
            'King of Clubs',
            'Ace of Clubs'
          )
        ).toEqual({ type: 'STRAIGHT', multiple: 12 });
      });
    });
  });

  describe('isTrumpedBy(play)', () => {
    it('singles', () => {
      expect([ '2 of Clubs' ]).toTrump([ '3 of Clubs' ]);
      expect([ '4 of Clubs' ]).toTrump([ '3 of Clubs' ]);
      expect([ 'Jack of Clubs' ]).toTrump([ '10 of Clubs' ]);
      expect([ 'Queen of Clubs' ]).toTrump([ 'Jack of Clubs' ]);
      expect([ 'King of Clubs' ]).toTrump([ 'Queen of Clubs' ]);
      expect([ 'Ace of Clubs' ]).toTrump([ 'King of Clubs' ]);
      expect([ '2 of Clubs' ]).toTrump([ 'Ace of Clubs' ]);
      expect([ 'Small Joker' ]).toTrump([ '2 of Clubs' ]);
      expect([ 'Big Joker' ]).toTrump([ 'Small Joker' ]);
      expect([ '5 of Hearts' ]).toTrump([ 'Big Joker' ]);

      expect(BOMB_4_OF_A_KIND).toTrump([ '5 of Hearts' ]);
      expect(BOMB_STRAIGHT_FLUSH).toTrump([ '5 of Hearts' ]);

      expect([ '2 of Clubs' ]).not.toTrump([ '2 of Hearts' ]);
    });

    it('pairs', () => {
      expect([
        '2 of Clubs', '2 of Spades'
      ]).toTrump([
        '3 of Clubs', '3 of Diamonds'
      ]);

      expect([
        '4 of Clubs', '4 of Spades'
      ]).toTrump([
        '3 of Clubs', '3 of Diamonds'
      ]);

      expect([
        '6 of Clubs', '6 of Spades'
      ]).toTrump([
        '5 of Hearts', '5 of Diamonds'
      ]);

      expect([
        'Jack of Clubs', 'Jack of Spades'
      ]).toTrump([
        '10 of Clubs', '10 of Diamonds'
      ]);

      expect([
        'Queen of Clubs', 'Queen of Spades'
      ]).toTrump([
        'Jack of Clubs', 'Jack of Diamonds'
      ]);

      expect([
        'King of Clubs', 'King of Spades'
      ]).toTrump([
        'Queen of Clubs', 'Queen of Diamonds'
      ]);

      expect([
        'Ace of Clubs', 'Ace of Spades'
      ]).toTrump([
        'King of Clubs', 'King of Diamonds'
      ]);

      expect([
        '2 of Clubs', '2 of Spades'
      ]).toTrump([
        'Ace of Clubs', 'Ace of Diamonds'
      ]);

      expect(['2 of Clubs', '2 of Spades'])
        .not.toTrump(BOMB_4_OF_A_KIND);
      expect(['2 of Clubs', '2 of Spades'])
        .not.toTrump(BOMB_STRAIGHT_FLUSH);

      expect([
        '2 of Clubs', '2 of Spades'
      ]).not.toTrump([
        '2 of Hearts', '2 of Diamonds'
      ]);
    });

    it('triples', () => {
      expect([
        '2 of Clubs', '2 of Spades', '2 of Diamonds'
      ]).toTrump([
        'Ace of Clubs', 'Ace of Diamonds', 'Ace of Hearts'
      ]);

      expect(['2 of Clubs', '2 of Spades', '2 of Diamonds'])
        .not.toTrump(BOMB_4_OF_A_KIND);
      expect(['2 of Clubs', '2 of Spades', '2 of Diamonds'])
        .not.toTrump(BOMB_STRAIGHT_FLUSH);
    });

    it('bomb', () => {
      expect([
        '2 of Clubs', '2 of Hearts', '2 of Hearts', '2 of Diamonds'
      ]).toTrump([
        '3 of Clubs', '3 of Hearts', '3 of Hearts', '3 of Diamonds'
      ]);
      expect([
        '4 of Clubs', '4 of Hearts', '4 of Hearts', '4 of Diamonds'
      ]).toTrump([
        '3 of Clubs', '3 of Hearts', '3 of Hearts', '3 of Diamonds'
      ]);
    });

    it('sisters', () => {
      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).toTrump([
        'Ace of Clubs', 'Ace of Hearts',
        'King of Hearts', 'King of Diamonds'
      ]);

      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds',
        'King of Hearts', 'King of Diamonds'
      ]).toTrump([
        'Ace of Clubs', 'Ace of Hearts',
        'King of Hearts', 'King of Diamonds',
        'Queen of Hearts', 'Queen of Diamonds'
      ]);

      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump(BOMB_4_OF_A_KIND);

      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump(BOMB_STRAIGHT_FLUSH);


      expect([
        '2 of Clubs', '2 of Hearts',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump([
        '2 of Diamonds', '2 of Spades',
        'Ace of Clubs', 'Ace of Spades'
      ]);
    });

    it('straight flush', () => {
      expect([
        '4 of Clubs', '5 of Clubs', '6 of Clubs', '7 of Clubs', '8 of Clubs'
      ]).toTrump([
        '3 of Clubs', '4 of Clubs', '5 of Clubs', '6 of Clubs', '7 of Clubs'
      ]);
    });

    it('full house', () => {
      expect([
        'Jack of Clubs', 'Jack of Hearts', 'Jack of Spades',
        '5 of Diamonds', '5 of Spades'
      ]).toTrump([
        '3 of Clubs', '3 of Hearts',
        '5 of Clubs', '5 of Diamonds', '5 of Spades'
      ]);

      expect([
        'Jack of Clubs', 'Jack of Hearts', 'Jack of Spades',
        '5 of Diamonds', '5 of Spades'
      ]).toTrump([
        'King of Clubs', 'King of Hearts',
        '5 of Clubs', '5 of Diamonds', '5 of Spades'
      ]);

      expect([
        '2 of Clubs', '2 of Hearts', '2 of Spades',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump(BOMB_4_OF_A_KIND);

      expect([
        '2 of Clubs', '2 of Hearts', '2 of Spades',
        'Ace of Hearts', 'Ace of Diamonds'
      ]).not.toTrump(BOMB_STRAIGHT_FLUSH);
    });

    it('straight', () => {
      expect([
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs',
        '8 of Diamonds'
      ]).toTrump([
        '3 of Diamonds',
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs'
      ]);

      expect([
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs',
        '8 of Diamonds'
      ]).not.toTrump(BOMB_4_OF_A_KIND);

      expect([
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs',
        '8 of Diamonds'
      ]).not.toTrump(BOMB_STRAIGHT_FLUSH);

      expect([
        '4 of Clubs',
        '5 of Clubs',
        '6 of Clubs',
        '7 of Clubs',
        '8 of Diamonds'
      ]).not.toTrump([
        '4 of Diamonds',
        '5 of Diamonds',
        '6 of Diamonds',
        '7 of Diamonds',
        '8 of Clubs'
      ]);
    });
  });
});

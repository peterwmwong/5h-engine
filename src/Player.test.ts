import Player from './Player';
import Card, { DECK } from './Card';

const PLAYER_1 = 'PLAYER_1';

const cardsByIds = (...ids:string[]):Card[] =>
  ids.map(id => {
    const card = DECK.find(c => c.id === id);
    if (!card) throw `Card not found ${id}`;
    return card;
  });

describe('Player', () => {
  describe('getAllCards(cardIds)', () => {
    let player:Player;
    beforeEach(() => {
      player = new Player(
        PLAYER_1,
        cardsByIds(
          '3 of Hearts',
          '4 of Diamonds',
          '5 of Clubs'
        )
      );
    });

    it('returns array of cards if player has all cardIds', () => {
      expect(
        player.getAllCards(['3 of Hearts'])
      ).toEqual(cardsByIds(
        '3 of Hearts'
      ));

      expect(
        player.getAllCards([
          '3 of Hearts',
          '4 of Diamonds',
          '5 of Clubs'
        ])
      ).toEqual(cardsByIds(
        '3 of Hearts',
        '4 of Diamonds',
        '5 of Clubs'
      ));
    });

    it("returns undefined if player doesn't have all cardIds", () => {
      expect(
        player.getAllCards(['3 of Diamonds'])
      ).toBeUndefined();

      expect(
        player.getAllCards([
          '3 of Hearts',
          '4 of Diamonds',
          '5 of Clubs',
          '6 of Spades'
        ])
      ).toBeUndefined();
    });
  });

  describe('removeCards(cardIds)', () => {
    let player:Player;
    beforeEach(() => {
      player = new Player(
        PLAYER_1,
        cardsByIds(
          '3 of Hearts',
          '4 of Diamonds',
          '5 of Clubs'
        )
      );
    });

    it('removes all cards with matching ids', () => {
      player.removeCards(['4 of Diamonds']);
      expect(player.cards).toEqual(
        cardsByIds(
          '3 of Hearts',
          '5 of Clubs'
        )
      );

      player.removeCards([
        '3 of Hearts',
        '5 of Clubs'
      ]);
      expect(player.cards).toEqual([]);
    });
  });
});

import Card, { DECK } from './Card';
import { ALL_CARD_NAMES } from './CardTestConstants'

describe('Card', () => {
  let cards: Card[];
  beforeEach(() => {
    cards = [...DECK];
  });

  it('instanceof Card', () => {
    cards.forEach(card => {
      expect(card).toBeInstanceOf(Card);
    });
  });

  it('Has all the cards', () => {
    const actualCardNames: string[] = cards.map(card => card.name).sort();
    expect(actualCardNames).toEqual(ALL_CARD_NAMES);
  });
});

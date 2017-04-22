import flatten from './utils/flatten';

export const ALL_CARD_NAMES = [
  ...flatten(
    ['Spades', 'Diamonds', 'Clubs', 'Hearts']
      .map(suit => [
        `Ace of ${suit}`,
        `2 of ${suit}`,
        `3 of ${suit}`,
        `4 of ${suit}`,
        `5 of ${suit}`,
        `6 of ${suit}`,
        `7 of ${suit}`,
        `8 of ${suit}`,
        `9 of ${suit}`,
        `10 of ${suit}`,
        `Jack of ${suit}`,
        `Queen of ${suit}`,
        `King of ${suit}`,
      ])
  ),
  'Big Joker',
  'Small Joker'
].sort();

import flatten from './utils/flatten';

const ID_TO_CARD:Map<string, Card> = new Map();

export default class Card {
  readonly rank:number;
  readonly singleRank:number;
  readonly suit:string;
  readonly id:string;

  constructor(rank:number, value:string, suit = '', singleRank = rank) {
    this.rank = rank;
    this.singleRank = singleRank;
    this.suit = suit;
    this.id = suit ? `${value} of ${suit}` : value;

    ID_TO_CARD.set(this.id, this);
  }

  get name():string { return this.id; }
}

export const DECK:Card[] = [
  ...flatten(
    [ 'Hearts', 'Spades', 'Clubs', 'Diamonds' ].map(suit => [
      new Card(1, '3', suit),
      new Card(2, '4', suit),
      new Card(3, '5', suit, suit === 'Hearts' ? 16 : 3),
      new Card(4, '6', suit),
      new Card(5, '7', suit),
      new Card(6, '8', suit),
      new Card(7, '9', suit),
      new Card(8, '10', suit),
      new Card(9, 'Jack', suit),
      new Card(10, 'Queen', suit),
      new Card(11, 'King', suit),
      new Card(12, 'Ace', suit),
      new Card(13, '2', suit)
    ])
  ),
  new Card(14, 'Small Joker'),
  new Card(15, 'Big Joker')
];

export const getCard = (id:string):Card => {
  const card = ID_TO_CARD.get(id);
  if (card === undefined) throw `Couldn't find ${id}`;
  return card;
}

export const getCards = (...ids:string[]):Card[] => ids.map(getCard);

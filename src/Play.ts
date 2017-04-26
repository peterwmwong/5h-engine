import Card from './Card';
import Player from './Player';
import groupsOfSize from './utils/groupsOfSize';

type PlayType = (
    'INVALID'
  | 'SINGLES'
  | 'PAIRS'
  | 'TRIPLES'
  | 'PAIRS_SISTERS'
  | 'TRIPLES_SISTERS'
  | 'STRAIGHT'
  | 'FULL_HOUSE'
  | 'BOMB'
  | 'STRAIGHT_FLUSH'
);

const lastCardRank = (cards: Card[]):number =>
  cards[cards.length - 1].rank;

export const compareRank = (a:Card, b:Card):number =>
  a.rank - b.rank;

export const compareStraightRank = (a:Card, b:Card):number =>
  a.straightRank - b.straightRank;

export const same = (attr:keyof Card, cards:Card[]):boolean =>
  cards[0][attr] === cards[cards.length - 1][attr];

const sameStraightRank = (cards:Card[]):boolean => same('straightRank', cards);
const sameRank = (cards:Card[]):boolean => same('rank', cards);
const sameSuit = (cards:Card[]):boolean => same('suit', cards);

// TODO: Test that a straight cannot have 2 high, small joker or big joker...
export const isStraight = (cards:Card[]):boolean =>
  [...cards].sort(compareStraightRank).every((c, i) =>
    i === 0 || c.straightRank - cards[i - 1].straightRank === 1 // Every card is one more than the previous
  );

export const isSisters = (sortedCards:Card[], size:number):boolean => {
  if(sortedCards.length % size !== 0) return false;

  const groups = groupsOfSize(sortedCards, size);
  return (
    groups.every(sameStraightRank) &&  // Cards of each group have the same rank
    isStraight(groups.map(([c]) => c)) // Each group's rank make a straight
  );
}

// Assumption: input is sorted
export const isFullHouse = ([a, b, c, d, e]:Card[]):boolean =>
  (sameRank([c, d, e]) && sameRank([a, b])) || // XX YYY
  (sameRank([a, b, c]) && sameRank([d, e]));   // XXX YY

// Assumption: input is sorted and is a full house
export const fullHouseRank = ([, {rank: a}, {rank: b},,]:Card[]):number =>
  a === b ? a : b;

const typeForCards = (cards:Card[]):{ type:PlayType, multiple?:number } => {
  const numCards:number = cards.length;
  switch(numCards){
    case 0: return { type: 'INVALID' };
    case 1: return { type: 'SINGLES' };
    case 2: return (
      sameRank(cards)
        ? { type: 'PAIRS' }
        : { type: 'INVALID' }
    );
    case 3: return (
      sameRank(cards)
        ? { type: 'TRIPLES' }
        : { type: 'INVALID' }
    );
    case 4: return (
        isSisters(cards, 2) ? { type: 'PAIRS_SISTERS', multiple: 2 }
      : sameRank(cards)     ? { type: 'BOMB' }
      : { type: 'INVALID' }
    );
    case 5: return (
        isStraight(cards)  ? (sameSuit(cards) ? { type: 'STRAIGHT_FLUSH' }
                                              : { type: 'STRAIGHT', multiple: 5 })
      : isFullHouse(cards) ? { type: 'FULL_HOUSE' }
      : { type: 'INVALID' }
    );
    default: return (
        isSisters(cards, 2) ? { type: 'PAIRS_SISTERS', multiple: numCards / 2  }
      : isSisters(cards, 3) ? { type: 'TRIPLES_SISTERS', multiple: numCards / 3 }
      : isStraight(cards)   ? { type: 'STRAIGHT', multiple: numCards }
      : { type: 'INVALID' }
    );
  }
}

export default class Play {
  readonly player:Player;
  readonly cards:Card[];
  readonly type:PlayType;
  readonly multiple:number;

  constructor(player:Player, cards:Card[]) {
    this.player = player;
    this.cards = cards.sort(compareRank);

    const { type, multiple = 1 } = typeForCards(this.cards);
    this.type = type;
    this.multiple = multiple;
  }

  isTrumpedBy({ cards, type, multiple }:Play):boolean {
    if (this.type === type && this.multiple === multiple) {
      return (
          this.type === 'FULL_HOUSE' ? fullHouseRank(this.cards) < fullHouseRank(cards)
        : this.type === 'SINGLES'    ? this.cards[0].singleRank < cards[0].singleRank
        : lastCardRank(this.cards) < lastCardRank(cards)
      );
    }
    return type === 'BOMB' || type === 'STRAIGHT_FLUSH';
  }
}

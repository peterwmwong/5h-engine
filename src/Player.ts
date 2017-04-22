import Card from './Card';

export default class Player {
  id:string;
  cards:Card[];

  constructor(id:string, cards:Card[]=[]) {
    this.id = id;
    this.cards = cards;
  }

  getAllCards(cardIds:string[]):(Card[] | undefined) {
    const cards:Card[] = [];
    for (let cardId of cardIds) {
      const card = this.cards.find(c => c.id === cardId);
      if (card === undefined) return undefined;
      cards.push(card);
    }
    return cards;
  }

  removeCards(cardIds:string[]):void {
    this.cards = this.cards.filter(c =>
      cardIds.indexOf(c.id) === -1
    );
  }
}

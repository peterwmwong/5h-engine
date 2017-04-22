import Play from './Play';
import Player from './Player';
import Card from './Card';

export type TurnPlayError = (
    "It is not the player's turn"
  | "Player doesn't have the cards"
  | "Cards do not trump previously played cards"
  | "Turn has already completed"
);

export default class Turn {
  currentPlayer:Player;
  isDone:boolean = false;
  lastPlay:(Play | undefined) = undefined;
  readonly players:Player[];
  readonly playersThatPassed:Player[] = [];
  winner:(Player | undefined);

  // `currentPlayer` is the player with control (makes the first play)
  constructor(players:Player[], currentPlayer:Player) {
    this.players = players;
    this.currentPlayer = currentPlayer;
  }

  // A list of player's that still of cards, ordered by player rotation (first
  // in the list is the next player)
  get playersWithCards():Player[] {
    const { currentPlayer, players } = this;
    let index = players.indexOf(currentPlayer) + 1;
    return [
      ...players.slice(index),
      ...players.slice(0, index),
    ].filter(p => p.cards.length > 0);
  }

  play(playerId:string, cardIds:string[]):(TurnPlayError | undefined) {
    const { currentPlayer, lastPlay, players, playersThatPassed, winner } = this;

    if (winner !== undefined)
      return "Turn has already completed";

    // Verify player is the current player
    if (currentPlayer.id !== playerId)
      return "It is not the player's turn";

    // If the player has passed...
    if (cardIds.length === 0) {
      playersThatPassed.push(currentPlayer);
    }
    else {
      // Verify current player has all cards
      const cards = currentPlayer.getAllCards(cardIds);
      if (cards === undefined)
        return "Player doesn't have the cards";

      // Verify cards are a valid play
      const newPlay = new Play(currentPlayer, cards);
      if (lastPlay !== undefined && !lastPlay.isTrumpedBy(newPlay))
        return "Cards do not trump previously played cards";

      // Take card from player
      currentPlayer.removeCards(cardIds);

      this.lastPlay = newPlay;
    }

    // Is the turn over?
    const { playersWithCards } = this;
    if (this.lastPlay !== undefined && (playersThatPassed.length === players.length - 1 || playersWithCards.length === 1)) {
      this.winner = this.lastPlay.player;
      this.isDone = true;
    }
    else {
      // If there's still no winner, rotate to the next player
      this.currentPlayer = this.playersWithCards[0];
    }
  }
}

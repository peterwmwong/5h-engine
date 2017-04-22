import Player from './Player';
import Turn, { TurnPlayError } from './Turn';
import Play from './Play';
import Card, { DECK, getCard } from './Card';
import shuffle from './utils/shuffle';

const THREE_OF_HEARTS:Card = getCard('3 of Hearts');

// Assigns every card in the deck to a player.
// Returns the player dealt the 3 of Hearts.
const dealCards = (players:Player[]):Player => {
  const numPlayers = players.length;
  let playerWith3OfHearts:(Player | undefined) = undefined;

  shuffle([...DECK]).forEach((card, i) => {
    const player = players[i % numPlayers];
    player.cards.push(card);
    if (card === THREE_OF_HEARTS) playerWith3OfHearts = player;
  });

  if (playerWith3OfHearts === undefined)
    throw "No player was dealt a 3 of Hearts...";

  return playerWith3OfHearts;
};

type GamePlayError = (
    TurnPlayError
  | "Game has already completed"
);

const getPlayerStartingNewTurn = (prevTurnWinner:Player, players:Player[]):(Player | undefined) => {
  const indexOfWinner = players.indexOf(prevTurnWinner);
  return [
    ...players.slice(indexOfWinner),
    ...players.slice(0, indexOfWinner)
  ].find(p => p.cards.length > 0);
}

export default class Game {
  currentTurn:Turn;
  players:Player[];
  previousTurn:(Turn | undefined) = undefined;
  winner:(Player | undefined) = undefined;

  constructor(playerIds:string[]) {
    const players = this.players = playerIds.map(id => new Player(id));
    const playerWith3OfHearts = dealCards(players);
    this.currentTurn = new Turn(players, playerWith3OfHearts);
  }

  get loser() {
    const { playersWithCards } = this;
    if (playersWithCards.length === 1) return playersWithCards[0];
  }

  get isDone() { return this.loser !== undefined; }

  play(playerId:string, cardIds:string[]):(GamePlayError | undefined) {
    if (this.isDone)
      return "Game has already completed";

    const { currentTurn, players } = this;
    const { currentPlayer } = currentTurn;
    const playError:(TurnPlayError | undefined) = currentTurn.play(playerId, cardIds);

    // Pass on any turn errors
    if (playError !== undefined)
      return playError;

    // Check for a winner
    if (this.winner === undefined && currentTurn.currentPlayer.cards.length === 0)
      this.winner = currentTurn.currentPlayer;

    // Start a new turn if the current turn is done and no loser
    if (currentTurn.isDone && this.loser === undefined)
      this.startNewTurn();
  }

  private startNewTurn() {
    const { players } = this;
    const { winner } = this.previousTurn = this.currentTurn;

    if (winner === undefined)
      throw 'Previous turn did not have a winner';

    const startingPlayer = getPlayerStartingNewTurn(winner, players);
    if (startingPlayer === undefined)
      throw 'Could not find a player with cards';

    this.currentTurn = new Turn(players, startingPlayer);
  }

  private get playersWithCards():Player[] {
    return this.players.filter(p => p.cards.length > 0);
  }
}

import Turn from './Turn';
import Player from './Player';
import { getCards } from './Card';

const PLAYER_1 = 'PLAYER_1';
const PLAYER_2 = 'PLAYER_2';

type TurnState = {
  winner: (string | undefined),
  player1Cards: string[],
  player2Cards: string[],
  currentPlayer: (string | undefined),
  lastPlayedCards: string[]
  playersThatPassed: string[]
};

const verifyTurnState = (turn:Turn, expected:TurnState) => {
  const player1 = turn.players.find(p => p.id === PLAYER_1);
  const player2 = turn.players.find(p => p.id === PLAYER_2);
  if (player1 === undefined || player2 === undefined) throw "Couldn't find players";

  expect(turn.winner && turn.winner.id).toBe(expected.winner);
  expect(turn.currentPlayer && turn.currentPlayer.id).toBe(expected.currentPlayer);
  expect(turn.lastPlay ? turn.lastPlay.cards : []).toEqual(getCards(...expected.lastPlayedCards));
  expect(player1.cards).toEqual(getCards(...expected.player1Cards));
  expect(player2.cards).toEqual(getCards(...expected.player2Cards));
}

describe('[Integration] Turn', () => {
  it('Plays a turn', () => {
    const player1:Player = new Player(PLAYER_1, getCards(
      '3 of Hearts',
      'Jack of Hearts',
      'King of Hearts',
      'Small Joker',
      '5 of Hearts'
    ));

    const player2:Player = new Player(PLAYER_2, getCards(
      '10 of Hearts',
      'Queen of Hearts',
      '2 of Hearts',
      'Big Joker',
      '4 of Clubs'
    ));

    const turn = new Turn([ player1, player2 ], player1);

    turn.play(PLAYER_1, ['3 of Hearts']);

    verifyTurnState(turn, {
      winner: undefined,
      player1Cards: [
        'Jack of Hearts',
        'King of Hearts',
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        '10 of Hearts',
        'Queen of Hearts',
        '2 of Hearts',
        'Big Joker',
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_2,
      lastPlayedCards: [
        '3 of Hearts'
      ],
      playersThatPassed: []
    });


    turn.play(PLAYER_2, ['10 of Hearts']);


    verifyTurnState(turn, {
      winner: undefined,
      player1Cards: [
        'Jack of Hearts',
        'King of Hearts',
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        'Queen of Hearts',
        '2 of Hearts',
        'Big Joker',
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_1,
      lastPlayedCards: [
        '10 of Hearts'
      ],
      playersThatPassed: []
    });


    turn.play(PLAYER_1, ['Jack of Hearts']);


    verifyTurnState(turn, {
      winner: undefined,
      player1Cards: [
        'King of Hearts',
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        'Queen of Hearts',
        '2 of Hearts',
        'Big Joker',
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_2,
      lastPlayedCards: [
        'Jack of Hearts'
      ],
      playersThatPassed: []
    });


    turn.play(PLAYER_2, ['Queen of Hearts']);


    verifyTurnState(turn, {
      winner: undefined,
      player1Cards: [
        'King of Hearts',
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        '2 of Hearts',
        'Big Joker',
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_1,
      lastPlayedCards: [
        'Queen of Hearts'
      ],
      playersThatPassed: []
    });


    turn.play(PLAYER_1, ['King of Hearts']);


    verifyTurnState(turn, {
      winner: undefined,
      player1Cards: [
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        '2 of Hearts',
        'Big Joker',
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_2,
      lastPlayedCards: [
        'King of Hearts'
      ],
      playersThatPassed: []
    });


    turn.play(PLAYER_2, ['2 of Hearts']);


    verifyTurnState(turn, {
      winner: undefined,
      player1Cards: [
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        'Big Joker',
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_1,
      lastPlayedCards: [
        '2 of Hearts'
      ],
      playersThatPassed: []
    });


    turn.play(PLAYER_1, ['Small Joker']);


    verifyTurnState(turn, {
      winner: undefined,
      player1Cards: [
        '5 of Hearts'
      ],
      player2Cards: [
        'Big Joker',
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_2,
      lastPlayedCards: [
        'Small Joker'
      ],
      playersThatPassed: []
    });


    turn.play(PLAYER_2, ['Big Joker']);


    verifyTurnState(turn, {
      winner: undefined,
      player1Cards: [
        '5 of Hearts'
      ],
      player2Cards: [
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_1,
      lastPlayedCards: [
        'Big Joker'
      ],
      playersThatPassed: []
    });


    turn.play(PLAYER_1, ['5 of Hearts']);


    verifyTurnState(turn, {
      winner: PLAYER_1,
      player1Cards: [],
      player2Cards: [
        '4 of Clubs'
      ],
      currentPlayer: PLAYER_1,
      lastPlayedCards: [
        '5 of Hearts'
      ],
      playersThatPassed: []
    });
  });
});

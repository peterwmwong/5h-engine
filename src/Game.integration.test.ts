import Game from './Game';
import Player from './Player';
import Card, { getCards } from './Card';
import { ALL_CARD_NAMES } from './CardTestConstants';
import flatten from './utils/flatten';

const PLAYER_1 = 'PLAYER_1';
const PLAYER_2 = 'PLAYER_2';

type GameState = {
  winner: (Player | undefined),
  loser: (Player | undefined),
  player1Cards: string[],
  player2Cards: string[]
};

const playerById = (game:Game, playerId:string):Player => {
  const player = game.players.find(p => p.id === playerId);
  if (player === undefined) throw "Could not find player";
  return player;
}

const verifyGameState = (game:Game, expected:GameState) => {
  expect(game.winner)
    .toBe(expected.winner);

  expect(game.loser)
    .toBe(expected.loser);

  expect(playerById(game, PLAYER_1).cards)
    .toEqual(getCards(...expected.player1Cards));

  expect(playerById(game, PLAYER_2).cards)
    .toEqual(getCards(...expected.player2Cards));
}

describe('[Integration] Game', () => {
  it('Plays a multi-turn game', () => {
    const game = new Game([ PLAYER_1, PLAYER_2 ]);

    const player1 = playerById(game, PLAYER_1);
    const player2 = playerById(game, PLAYER_2);

    player1.cards = getCards(
      '3 of Hearts',
      'Jack of Hearts',
    );
    game.currentTurn.currentPlayer = player1;

    player2.cards = getCards(
      '10 of Hearts',
      'Jack of Spades',
      'Queen of Hearts'
    );


    game.play(PLAYER_1, ['3 of Hearts']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        'Jack of Hearts'
      ],
      player2Cards: [
        '10 of Hearts',
        'Jack of Spades',
        'Queen of Hearts'
      ]
    });


    game.play(PLAYER_2, ['Queen of Hearts']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        'Jack of Hearts'
      ],
      player2Cards: [
        '10 of Hearts',
        'Jack of Spades'
      ]
    });


    game.play(PLAYER_1, []);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        'Jack of Hearts'
      ],
      player2Cards: [
        '10 of Hearts',
        'Jack of Spades'
      ]
    });


    game.play(PLAYER_2, ['Jack of Spades']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        'Jack of Hearts'
      ],
      player2Cards: [
        '10 of Hearts'
      ]
    });
  });

  it('Plays a game', () => {
    const game = new Game([ PLAYER_1, PLAYER_2 ]);

    const player1 = playerById(game, PLAYER_1);
    const player2 = playerById(game, PLAYER_2);

    player1.cards = getCards(
      '3 of Hearts',
      'Jack of Hearts',
      'King of Hearts',
      'Small Joker',
      '5 of Hearts'
    );
    game.currentTurn.currentPlayer = player1;

    player2.cards = getCards(
      '10 of Hearts',
      'Queen of Hearts',
      '2 of Hearts',
      'Big Joker',
      '4 of Clubs'
    );


    game.play(PLAYER_1, ['3 of Hearts']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
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
      ]
    });


    game.play(PLAYER_2, ['10 of Hearts']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
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
      ]
    });


    game.play(PLAYER_1, ['Jack of Hearts']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
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
      ]
    });


    game.play(PLAYER_2, ['Queen of Hearts']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        'King of Hearts',
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        '2 of Hearts',
        'Big Joker',
        '4 of Clubs'
      ]
    });


    game.play(PLAYER_1, ['King of Hearts']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        '2 of Hearts',
        'Big Joker',
        '4 of Clubs'
      ]
    });


    game.play(PLAYER_2, ['2 of Hearts']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        'Small Joker',
        '5 of Hearts'
      ],
      player2Cards: [
        'Big Joker',
        '4 of Clubs'
      ]
    });


    game.play(PLAYER_1, ['Small Joker']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        '5 of Hearts'
      ],
      player2Cards: [
        'Big Joker',
        '4 of Clubs'
      ]
    });


    game.play(PLAYER_2, ['Big Joker']);


    verifyGameState(game, {
      winner: undefined,
      loser: undefined,
      player1Cards: [
        '5 of Hearts'
      ],
      player2Cards: [
        '4 of Clubs'
      ]
    });


    game.play(PLAYER_1, ['5 of Hearts']);


    verifyGameState(game, {
      winner: player1,
      loser: player2,
      player1Cards: [],
      player2Cards: [
        '4 of Clubs'
      ]
    });
  });
});

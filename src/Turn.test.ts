import Turn, { TurnPlayError } from './Turn';
import Player from './Player';
import Play from './Play';
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

const verifyTurnState = (turn:Turn, expected:TurnState):void => {
  const player1 = turn.players.find(p => p.id === PLAYER_1);
  const player2 = turn.players.find(p => p.id === PLAYER_2);
  if (player1 === undefined || player2 === undefined) throw "Couldn't find players";

  expect(turn.winner && turn.winner.id).toBe(expected.winner);
  expect(turn.currentPlayer && turn.currentPlayer.id).toBe(expected.currentPlayer);
  expect(turn.lastPlay ? turn.lastPlay.cards : []).toEqual(getCards(...expected.lastPlayedCards));
  expect(player1.cards).toEqual(getCards(...expected.player1Cards));
  expect(player2.cards).toEqual(getCards(...expected.player2Cards));
}

describe('Turn', () => {
  let player1:Player;
  let player2:Player;

  beforeEach(() => {
    player1 = new Player(PLAYER_1, getCards('3 of Hearts', '4 of Hearts'));
    player2 = new Player(PLAYER_2, getCards('5 of Hearts', '6 of Hearts'));
  });

  // TODO: 3 players, 1 player runs out of cards, the turn continues with the 2 other players

  describe('play(playerId, cardIds)', () => {
    let turn:Turn;
    let initialState:TurnState;

    beforeEach(() => {
      turn = new Turn([player1, player2], player1);
      initialState = {
        winner: undefined,
        player1Cards: ['3 of Hearts', '4 of Hearts'],
        player2Cards: ['5 of Hearts', '6 of Hearts'],
        currentPlayer: PLAYER_1,
        lastPlayedCards: [],
        playersThatPassed: []
      };
      verifyTurnState(turn, initialState);
    })

    describe("when the turn is over already (there's already a winner)", () => {
      beforeEach(() => {
        turn.winner = player2;
        initialState = {
          ...initialState,
          winner: PLAYER_2
        };
      });

      it("returns the error ", () => {
        expect(turn.play(PLAYER_1, ['3 of Hearts']))
          .toBe("Turn has already completed");
      });

      it("doesn't change the state", () => {
        verifyTurnState(turn, initialState);
      });
    });

    describe("when it's another player's turn", () => {
      it("returns the error", () => {
        expect(turn.play(PLAYER_2, ['3 of Hearts']))
          .toBe("It is not the player's turn");
      });

      it("doesn't change the state", () => {
        verifyTurnState(turn, initialState);
      });
    });

    describe("when the player does not have all the cards attempting to be played", () => {
      it("returns error", () => {
        expect(turn.play(PLAYER_1, ['3 of Hearts', '5 of Hearts']))
          .toBe("Player doesn't have the cards");
      });

      it("doesn't change the state", () => {
        verifyTurnState(turn, initialState);
      });
    });

    describe("when the player does not have all the cards attempting to be played", () => {
      beforeEach(() => {
        turn.lastPlay = new Play(player1, getCards('3 of Spades'));
        initialState = {
          ...initialState,
          lastPlayedCards: ['3 of Spades']
        };
      });

      it("returns error", () => {
        expect(turn.play(PLAYER_1, ['3 of Hearts']))
          .toBe("Cards do not trump previously played cards");
      });

      it("doesn't change the state", () => {
        verifyTurnState(turn, initialState);
      });
    });

    describe("when the current player plays their last card", () => {
      let result:(undefined | TurnPlayError);
      beforeEach(() => {
        turn.lastPlay = new Play(player1, getCards('3 of Spades'));
        player1.cards = getCards('4 of Hearts');
        initialState = {
          ...initialState,
          player1Cards: ['4 of Hearts'],
          lastPlayedCards: ['3 of Spades']
        };

        result = turn.play(PLAYER_1, ['4 of Hearts']);
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });

      it("current player is declared the winner of the turn", () => {
        verifyTurnState(turn, {
          ...initialState,
          winner: PLAYER_1,
          player1Cards: [],
          lastPlayedCards: ['4 of Hearts']
        });
      });
    });

    describe("when the last player passes", () => {
      let result:(undefined | TurnPlayError);
      beforeEach(() => {
        player1.cards = getCards('4 of Hearts');
        turn.currentPlayer = player2;
        turn.play(PLAYER_2, ['5 of Hearts'])
        initialState = {
          winner: undefined,
          playersThatPassed: [],
          currentPlayer: PLAYER_1,
          player2Cards: ['6 of Hearts'],
          player1Cards: ['4 of Hearts'],
          lastPlayedCards: ['5 of Hearts']
        }

        turn.play(PLAYER_1, []);
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });

      it("player that last played cards is declared the winner of the turn", () => {
        verifyTurnState(turn, {
          ...initialState,
          winner: PLAYER_2
        });
      });
    });

    describe("when a valid play is made by the current player", () => {
      let result:(undefined | TurnPlayError);
      beforeEach(() => {
        turn.lastPlay = new Play(player1, getCards('3 of Spades'));
        initialState = {
          winner: undefined,
          player1Cards: ['3 of Hearts', '4 of Hearts'],
          player2Cards: ['5 of Hearts', '6 of Hearts'],
          currentPlayer: PLAYER_1,
          lastPlayedCards: ['3 of Spades'],
          playersThatPassed: []
        }

        result = turn.play(PLAYER_1, ['4 of Hearts']);
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });

      it("removes cards from player, updates the current player and tracks the last played cards", () => {
        verifyTurnState(turn, {
          ...initialState,
          player1Cards: ['3 of Hearts'],
          currentPlayer: PLAYER_2,
          lastPlayedCards: ['4 of Hearts']
        });
      });
    })
  });
});

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

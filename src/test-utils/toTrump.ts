import Play from '../Play';
import Player from '../Player';
import Card, { getCards } from '../Card';

declare global {
  namespace jest {
    export interface Matchers<R> {
      /**
       * Verifies a set of cards trumps another.
       *
       * Example:
       *
       *      expect(['2 of Hearts']).toTrump(['Ace of Hearts']);
       *
       * @param expected Cards that would be trumped
       */
      toTrump(expected: string[]): R;
    }
  }
}

const PLAYER = new Player('test', []);
expect.extend({
  toTrump(received, argument) {
    const play1 = new Play(PLAYER, getCards(...argument));
    const play2 = new Play(PLAYER, getCards(...received));
    const pass = play1.isTrumpedBy(play2);
    const displayReceived = received.join(', ');
    const argReceived = argument.join(', ');
    return {
      pass,
      message: () => `expected [${displayReceived}]${pass ? 'NOT' : ''} to trump [${argReceived}]`
    };
  }
});

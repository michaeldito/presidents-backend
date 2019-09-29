const Utils = require('../../../utils');

/**
 * Algorithm:
 *  1. Get the latest round.
 *  2. Slice the array so that it contains the current player's last turn and every
 *     turn after it.
 *  2a. Do so by searching through the array starting from the end to find the index
 *      of the current player's last turn.
 *  2b. If a turn is not found then return false because they haven't played in the current
 *      round yet.
 *  3. If the turn was found and we have sliced the array, check if the turn was a pass or
 *     a skip. If so return false because they couldn't have ended the round with that.
 *  4. Check the turns immediately after the current player's last turn for a skip.
 *  5. Once all skips have been iterated over begin checking for passes. If any player didn't
 *     pass then they must have played a turn better than the current player, so return false.
 *  6. If we finish iterating over the rest of the turns then nobody played a better hand,
 *     and therefore the current player's turn ended the round, so return true.
 */
module.exports = function() {
  let latestRound = this.rounds[this.rounds.length - 1];
  let playersLastTurnIdx;
  let searchingForLastTurn = true;
  let foundLastTurn = false;
  let i = latestRound.turns.length;
  while (searchingForLastTurn) {
    i--;
    let turn = latestRound.turns[i];
    if (turn.user.toString() === this.currentPlayer.toString()) {
      playersLastTurnIdx = i;
      searchingForLastTurn = false;
      foundLastTurn = true;
    }
  }
  // console.log(`playersLastTurnIdx: ${playersLastTurnIdx}`);

  let turns = latestRound.turns.slice(playersLastTurnIdx);

  if (! foundLastTurn) {
    // console.log(`foundLastTurn: ${foundLastTurn}`);
    return false;
  }

  let playersLastTurn = turns[0];
  if (playersLastTurn.wasSkipped || playersLastTurn.wasPassed) {
    // console.log(`wasSkipped ${playersLastTurn.wasSkipped} | wasPassed ${playersLastTurn.wasPassed}`);
    return false;
  }

  i = 1;
  let checkingForSkips = true;
  // console.log(`checkingForSkips: ${checkingForSkips}`);
  while (checkingForSkips && i < turns.length) {
    let turn = turns[i];
    // console.log(`turn: ${turn.user} ${turn.wasSkipped}`);
    if (! turn.wasSkipped) {
      checkingForSkips = false;
    } else {
      i++;
    }
  }

  let checkingForPasses = true;
  // console.log(`checkingForPasses: ${checkingForPasses}`);
  while (checkingForPasses && i < turns.length) {
    let turn = turns[i];
    // console.log(`turn: ${turn.user} ${turn.wasPassed}`);
    if (! turn.wasPassed) {
      // console.log(`someone played a better hand: ${turn.cardsPlayed}`);
      return false;
    } else {
      i++;
    }
  }

  // console.log('all turns were passes after maybe a skip')
  return true;
}
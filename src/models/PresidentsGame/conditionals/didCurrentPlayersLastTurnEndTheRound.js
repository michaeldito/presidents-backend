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
  console.log('[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()]');
  let latestRound = this.rounds[this.rounds.length - 1];
  console.log(`latestRound ${latestRound}`)
  let playersLastTurnIdx;
  let searchingForLastTurn = true;
  let foundLastTurn = false;
  let i = latestRound.turns.length;
  console.log(`i ${i}`)

  if (i < this.players.length) {
    console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] not all players have played a turn yet so no`);
    return false;
  }

  while (searchingForLastTurn) {
    i--;
    let turn = latestRound.turns[i];
    if (this.currentPlayer.equals(turn.user)) {
      playersLastTurnIdx = i;
      searchingForLastTurn = false;
      foundLastTurn = true;
    }
  }
  console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] playersLastTurnIdx: ${playersLastTurnIdx}`);

  // TODO:
  // if it was a two then yes it did, regardless of if all players have played

  if (! foundLastTurn) {
    console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] foundLastTurn: ${foundLastTurn}`);
    return false;
  }

  let turns = latestRound.turns.slice(playersLastTurnIdx);
  let playersLastTurn = turns[0];
  if (playersLastTurn.wasSkipped || playersLastTurn.wasPassed) {
    console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] wasSkipped ${playersLastTurn.wasSkipped} | wasPassed ${playersLastTurn.wasPassed}`);
    return false;
  }

  i = 1;
  let checkingForSkips = true;
  console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] checkingForSkips`);

  while (checkingForSkips && i < turns.length) {
    let turn = turns[i];
    console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] turn: ${turn.user} ${turn.wasSkipped}`);
    if (! turn.wasSkipped) {
      checkingForSkips = false;
    } else {
      console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] skip found by: ${turn.user}`);
      i++;
    }
  }

  let checkingForPasses = true;
  console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] checkingForPasses`);
  while (checkingForPasses && i < turns.length) {
    let turn = turns[i];
    if (! turn.wasPassed) {
      console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] user ${turn.user} played a better hand: ${turn.cardsPlayed.map(c=>c.shortHand)}`);
      return false;
    } else {
      console.log(`[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] turn for user: ${turn.user} was passed`);
      i++;
    }
  }

  console.log('[PresidentsGame@didCurrentPlayersLastTurnEndTheRound()] yes it ended the round')
  return true;
}
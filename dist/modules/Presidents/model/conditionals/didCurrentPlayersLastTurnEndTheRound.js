"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function _default() {
  (0, _logger.default)('[Presidents@didCurrentPlayersLastTurnEndTheRound()]');
  var latestRound = this.rounds[this.rounds.length - 1];
  (0, _logger.default)("latestRound ".concat(latestRound));
  var playersLastTurnIdx;
  var searchingForLastTurn = true;
  var foundLastTurn = false;
  var i = latestRound.turns.length;
  (0, _logger.default)("i ".concat(i));

  if (i < this.players.length) {
    (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] not all players have played a turn yet so no");
    return false;
  }

  while (searchingForLastTurn) {
    i--;
    var turn = latestRound.turns[i];

    if (this.currentPlayer.equals(turn.user)) {
      playersLastTurnIdx = i;
      searchingForLastTurn = false;
      foundLastTurn = true;
    }
  }

  (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] playersLastTurnIdx: ".concat(playersLastTurnIdx)); // TODO:
  // if it was a two then yes it did, regardless of if all players have played

  if (!foundLastTurn) {
    (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] foundLastTurn: ".concat(foundLastTurn));
    return false;
  }

  var turns = latestRound.turns.slice(playersLastTurnIdx);
  var playersLastTurn = turns[0];

  if (playersLastTurn.wasSkipped) {
    (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] did they skip themself and it's still there turn?");
    var searchingForWhoCausedSkip = true;

    while (searchingForWhoCausedSkip) {
      i--;
      var _turn = latestRound.turns[i];

      if (_turn.didCauseSkips) {
        if (this.currentPlayer.equals(_turn.user)) {
          (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] yes");
          return true;
        }

        (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] no");
        return false;
      }
    }

    return false;
  }

  if (playersLastTurn.wasPassed) {
    (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] wasPassed ".concat(playersLastTurn.wasPassed));
    return false;
  }

  i = 1;
  var checkingForSkips = true;
  (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] checkingForSkips");

  while (checkingForSkips && i < turns.length) {
    var _turn2 = turns[i];
    (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] turn: ".concat(_turn2.user, " ").concat(_turn2.wasSkipped));

    if (!_turn2.wasSkipped) {
      checkingForSkips = false;
    } else {
      (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] skip found by: ".concat(_turn2.user));
      i++;
    }
  }

  var checkingForPasses = true;
  (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] checkingForPasses");

  while (checkingForPasses && i < turns.length) {
    var _turn3 = turns[i];

    if (!_turn3.wasPassed) {
      (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] user ".concat(_turn3.user, " played a better hand: ").concat(_turn3.cardsPlayed.map(c => c.shortHand)));
      return false;
    }

    (0, _logger.default)("[Presidents@didCurrentPlayersLastTurnEndTheRound()] turn for user: ".concat(_turn3.user, " was passed"));
    i++;
  }

  (0, _logger.default)('[Presidents@didCurrentPlayersLastTurnEndTheRound()] yes it ended the round');
  return true;
}
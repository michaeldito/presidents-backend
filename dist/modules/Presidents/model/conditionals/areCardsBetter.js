"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(handToBeat, cards) {
  (0, _logger.default)('[PresidentsGame@areCardsBetter()]');
  var toBeat = handToBeat.map(c => {
    c.shortHand;
  });
  var c = cards.map(c => {
    c.shortHand;
  });
  (0, _logger.default)("[PresidentsGame@areCardsBetter()] handToBeat: ".concat(toBeat));
  (0, _logger.default)("[PresidentsGame@areCardsBetter()] cards: ".concat(c));
  var handToBeatCardRankValues = handToBeat.map(card => card.cardRank.value);
  var currentHandCardRankValues = cards.map(card => card.cardRank.value); // case 3: current hand has fewer cards than previous hand
  // case 3a: if it contains a 2 it's a valid turn

  var doesContainTwo = !!currentHandCardRankValues.find(value => value === 2);
  (0, _logger.default)("[PresidentsGame@areCardsBetter()] doesContainTwo: ".concat(doesContainTwo));

  if (doesContainTwo) {
    return Promise.resolve(true);
  } // case 1: current hand has more cards


  var doesCurrentHandHaveMoreCards = currentHandCardRankValues.length > handToBeatCardRankValues.length;
  (0, _logger.default)("[PresidentsGame@areCardsBetter()] doesCurrentHandHaveMoreCards: ".concat(doesCurrentHandHaveMoreCards));

  if (doesCurrentHandHaveMoreCards) {
    return Promise.resolve(true);
  } // case 2: current and previous hand have equal number of cards


  var areNumberOfCardsEqual = currentHandCardRankValues.length === handToBeatCardRankValues.length;
  (0, _logger.default)("[PresidentsGame@areCardsBetter()] areNumberOfCardsEqual: ".concat(areNumberOfCardsEqual));

  if (areNumberOfCardsEqual) {
    // case2a: cards are of same rank
    var areCardsSameRank = currentHandCardRankValues[0] === handToBeatCardRankValues[0];
    (0, _logger.default)("[PresidentsGame@areCardsBetter()] areCardsSameRank: ".concat(areCardsSameRank));

    if (areCardsSameRank) {
      return Promise.resolve(true);
    } // case2b: current hand's card rank beats previous turns card rank


    var doesCurrentHandRankBeatPrevious = currentHandCardRankValues[0] > handToBeatCardRankValues[0];
    (0, _logger.default)("[PresidentsGame@areCardsBetter()] doesCurrentHandRankBeatPrevious: ".concat(doesCurrentHandRankBeatPrevious));

    if (doesCurrentHandRankBeatPrevious) {
      return Promise.resolve(true);
    } // case2c: current turn's rank does not beat previous turns rank


    return Promise.reject(new Error("The rank of the selected cards does not beat the previous turns."));
  } // case 3b: if it does not contain a 2


  return Promise.reject(new Error("The selected cards contain fewer cards than the previous turn, and does not contain a two."));
}
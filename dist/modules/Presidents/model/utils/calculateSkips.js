"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(handToBeat, cards) {
  (0, _logger.default)('[Presidents@calculateSkips()]');
  (0, _logger.default)("[Presidents@calculateSkips()] handToBeat: ".concat(JSON.stringify(handToBeat)));
  (0, _logger.default)("[Presidents@calculateSkips()] cards: ".concat(JSON.stringify(cards))); // first hand of the game there will be no handToBeat

  if (handToBeat.length === 0) {
    (0, _logger.default)("[Presidents@calculateSkips()] 0");
    return 0;
  } // assume cards are valid and cards are better


  var handToBeatCardRankValue = handToBeat[0].cardRank.value;
  var cardRankValue = cards[0].cardRank.value;

  if (handToBeatCardRankValue === cardRankValue) {
    if (handToBeat.length === cards.length) {
      (0, _logger.default)('[Presidents@calculateSkips()] 1');
      return 1;
    }

    var result = 1 + cards.length - handToBeat.length;
    (0, _logger.default)("[Presidents@calculateSkips()] ".concat(result));
    return result;
  }

  (0, _logger.default)("[Presidents@calculateSkips()] 0");
  return 0;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("../../../../config/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(cards) {
  (0, _logger.default)('[Presidents@areCardsValid()]'); // is the current hand valid (all ranks the same)?

  var currentHandCardRankValues = cards.map(card => card.cardRank.value);
  var rankValue = currentHandCardRankValues[0];
  var areCardsValid = currentHandCardRankValues.every(cardRankValue => cardRankValue === rankValue);
  var result = !!areCardsValid;
  (0, _logger.default)("[Presidents@areCardsValid()] ".concat(result));
  return result;
}
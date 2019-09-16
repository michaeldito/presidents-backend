/**
 *  Skip processing
 */
module.exports = async function(skipsRemaining) {
  while (skipsRemaining) {
    const skipTurn = {
      user: this.currentPlayer,
      wasPassed: false,
      wasSkipped: true,
      didCauseSkips: false,
      skipsRemaining: skipsToProcess - 1,
      endedRound: false
    }
    skipsRemaining--;
    await this.processTurn(skipTurn);
  }
}
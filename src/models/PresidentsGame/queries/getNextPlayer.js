module.exports = async function() {
  console.log('[PresidentsGame@getNextPlayer()]');
  
  const currentPlayer = this.players.find(player => player.user._id.toString() === this.currentPlayer.toString());
  const currentSeatPosition = currentPlayer.seatPosition;
  console.log(`[PresidentsGame@getNextPlayer()] current seat position: ${currentSeatPosition}`);

  let nextSeatPosition = (currentSeatPosition + 1) % this.players.length;
  console.log(`[PresidentsGame@getNextPlayer()] nextSeatPosition: ${nextSeatPosition}`);

  let searching = true;
  let nextPlayer;

  console.log('[PresidentsGame@getNextPlayer()] begininng to search for next player')
  while (searching) {

    nextPlayer = this.players.find(player => player.seatPosition === nextSeatPosition);

    if (nextPlayer.toObject().hasOwnProperty('nextGameRank')) {
      console.log(`[PresidentsGame@getNextPlayer()] player ${nextPlayer.user} - ${nextPlayer.seatPosition} is not next bc they are out`);
      nextSeatPosition = (nextSeatPosition + 1) % this.players.length;
      console.log(`[PresidentsGame@getNextPlayer()] nextSeatPosition ${nextSeatPosition}`);

    } else {
      console.log(`[PresidentsGame@getNextPlayer()] user ${nextPlayer.user} is next`)
      searching = false;
    }
  }

  return nextPlayer.user;
}
module.exports = async function() {
  const currentPlayer = this.players.find(player => player.user.toString() === this.currentPlayer.toString());
  const currentSeatPosition = currentPlayer.seatPosition;
  // console.log(`current seat position: ${currentSeatPosition}`)
  const nextSeatPosition = (currentSeatPosition + 1) % this.players.length;
  // console.log(`nextSeatPosition: ${nextSeatPosition}`)
  // TODO: is the player out???
  const nextPlayer = this.players.find(player => player.seatPosition === nextSeatPosition);
  return nextPlayer;
}
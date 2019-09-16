module.exports = async function() {
  const currentPlayer = this.players.find(player => player.user.toString() === this.currentPlayer.toString());
  const currentSeatPosition = currentPlayer.seatPosition;
  const nextSeatPosition = (currentSeatPosition + 1) % this.config.maxPlayers;
  const nextPlayer = this.players.find(player => player.seatPosition === nextSeatPosition);
  return nextPlayer;
}
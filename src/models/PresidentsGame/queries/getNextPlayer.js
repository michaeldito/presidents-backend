module.exports = async function() {
  const currentPlayer = await this.players.find(player => player.user === this.currentPlayer);
  const currentSeatPosition = currentPlayer.seatPosition;
  const nextSeatPosition = (currentSeatPosition + 1) % (this.config.maxPlayers + 1);
  const nextPlayer = await this.players.find(player => player.seatPosition === nextSeatPosition);
  return nextPlayer;
}
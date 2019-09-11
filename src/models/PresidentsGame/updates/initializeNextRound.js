
module.exports = async function() {
  // validations

  // cannot start next round if game is finalized
  if (this.status.value === 'FINALIZED')
    return Promise.reject(new Error('Unable to start next round. The game is finalized.'));

  if (this.status.value === 'NOT_STARTED') {
    this.startedAt = new Date();
    this.status = await this.model('GameStatus').findOne({value: 'IN_PROGRESS'});
  }
  
  await this.round.push({});
}
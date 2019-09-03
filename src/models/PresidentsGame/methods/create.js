PresidentsGameSchema.statics.create = async function(user, {name}, gameConfig) {
  const alreadyExists = await PresidentsGame.findByName(name);
  if (alreadyExists)
    throw new Error('Unable to create game. A game with that name already exists.');

  // Create game and add player to it

  return this.findOne({name});
}
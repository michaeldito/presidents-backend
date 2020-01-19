import Utils from '../../../../utils';

/**
 *
 *
 */
export default async function(user) {
	console.log('[Presidents@drinkDrink()]');
	// given that user has no drinks when they try to drink then bail out
	// given player does have drinks to drink when they try to drink
	// then drinksDrunk is incremented

	const player = this.players.find(
		player => player.user._id.toString() === user._id.toString(),
	);
	const { drinksReceived, drinksDrunk } = player;

	const hasDrinksToDrink = drinksReceived.length - drinksDrunk === 0;
	console.log(`[Presidents@drinkDrink()] hasDrinksToDrink ${hasDrinksToDrink}`);
	if (hasDrinksToDrink) {
		return Promise.reject(
			new Error('Unable to drink any drinks. User has none to drink.'),
		);
	}

	player.drinksDrunk += 1;

	this.drinks.push({
		type: 'drink drunk',
		user: user.username,
	});

	return this.save();
}
import { tests } from '../modules/tests';

const model = process.argv[process.argv.length - 1];

const testSuite = async (model) => {
	switch (model) {
		case 'card':
			await tests.cardTests();
			break;
		case 'cardrank':
			await tests.cardRankTests();
			break;
		case 'game':
			await tests.gameTests();
			break;
		case 'gameconfiguration':
			await tests.gameConfigTests();
			break;
		case 'gamestatus':
			await tests.gameStatusTests();
			break;
		case 'politicalrank':
			await tests.politicalRankTests();
			break;
		case 'presidents':
			await tests.presidentsTests();
			break;
		case 'status':
			await tests.statusTests();
			break;
		case 'suit':
			await tests.suitTests();
			break;
		case 'user':
			await tests.userTests();
			break;
		default:
			await tests.suitTests();
			await tests.cardRankTests();
			await tests.cardTests();
			await tests.gameConfigTests();
			await tests.politicalRankTests();
			await tests.statusTests();
			await tests.gameStatusTests();
			await tests.userTests();
			await tests.gameTests();
			await tests.presidentsTests();
	}
};

(async () => {
	try {
		await testSuite(model);
	} catch (e) {
		console.log('[Unit:Test] test suite failed');
		console.log(e);
	}
})();

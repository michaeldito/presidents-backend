const { modelSuite, models } = require('../modules/tests');

const model = process.argv[process.argv.length - 1];

const testSuite = async () => {
  switch (model) {
    case 'card':
      await models.cardTests();
      break;
    case 'cardrank':
      await models.cardRankTests(); 
      break;
    case 'game':
      await models.gameTests();
      break;
    case 'config':
      await models.gameConfigTests();
      break;
    case 'gamestatus':
      await models.gameStatusTests();
      break;
    case 'inboxitem':
      await models.inboxItemTests();
      break;
    case 'invite':
      await models.inviteTests();
      break;
    case 'politicalrank':
      await models.politicalRankTests();
      break;
    case 'presidents':
      await models.presidentsTests();
      break;
    case 'status':
      await models.statusTests();
      break;
    case 'suit':
      await models.suitTests();
      break;
    case 'user':
      await models.userTests();
      break;
    default:
      await modelSuite();
  }
}

testSuite();
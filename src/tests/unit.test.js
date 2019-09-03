const { modelTests } = require('../models/tests');

const testSuite = async () => {
  await modelTests();
}

testSuite();
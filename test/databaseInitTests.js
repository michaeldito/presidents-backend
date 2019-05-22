const init = require('../src/controllers/Mongo/init');
const CardModel = require('../src/models/CardModel/index');
const CardRankModel = require('../src/models/CardRankModel/index');
const SuitModel = require('../src/models/SuitModel/index');
const PoliticalRankModel = require('../src/models/PoliticalRankModel/index');

describe('Initiallizing Database from scratch.', () => {

    describe('InitCards()', () => {    
        
        before((done) => {
            CardModel.deleteMany({}).then(() => {
                CardRankModel.deleteMany({}).then(() => {
                    SuitModel.deleteMany({}).then(() => {done()});
                });
            });
        });

        describe('Check that db collections are empty.', () => {

            it('No Card Ranks in DB', done => {
                CardRankModel.countDocuments({}).then(count => {
                    if (count)
                        done(new Error('There are ' + count + ' Card Ranks in the Database'));
                    else
                        done();
                });
            });

            it('No Suits in DB', done => {
                SuitModel.countDocuments({}).then(count => {
                    if (count)
                        done(new Error('There are ' + count + ' Suits in the Database'));
                    else
                        done();
                });
            });

            it('No Cards in DB', done => {
                CardModel.countDocuments({}).then(count => {
                    if (count)
                        done(new Error('There are ' + count + ' Cards in the Database'));
                    else
                        done();
                });
            });

        });

        describe('Initializing Cards', () => {

            it('initializeCards()', done => {
                init.initCards().finally(() => {
                    CardModel.countDocuments({}, (error, numberOfCards) => {
                        if (error)
                            done(error);
                        else if (numberOfCards != 52)
                            done(new Error('There should be 52 cards, but there are ' + numberOfCards));
                        else 
                            done();
                    });
                });
            });

            it('Check that calling initalize twice doesn\'t create duplicate instances', done => {
                init.initCards().finally(() => {
                    CardModel.countDocuments({}, (error, numberOfCards) => {
                        if (error)
                            done(error);
                        else if (numberOfCards != 52)
                            done(new Error('There should be 52 cards, but there are ' + numberOfCards));
                        else 
                            done();
                    });
                });

            });

        });

    });

    describe('initPoliticalRanks()', () => {
        
        before((done) => {
            PoliticalRankModel.deleteMany({}).then(() => {done()});
            });

        describe('Check that db collections are empty.', () => {

            it('No Political Ranks in DB', done => {
                PoliticalRankModel.countDocuments({}).then(count => {
                    if (count)
                        done(new Error('There are ' + count + ' Political Ranks in the Database'));
                    else
                        done();
                });
            });



        });

        describe('Initializing Political Ranks', () => {

            it('initializePoliticalRanks()', done => {
                init.initPoliticalRanks().finally(() => {
                    PoliticalRankModel.countDocuments({}, (error, numberOfPoliticalRanks) => {
                        if (numberOfPoliticalRanks != 8)
                            done(new Error('There should be 8 political ranks, but there are ' + numberOfPoliticalRanks));
                        else
                            done();
                    });
                });
            });

            it('Check that calling initalize twice doesn\'t create duplicate instances', done => {

                init.initPoliticalRanks().finally(() => {
                    PoliticalRankModel.countDocuments({}, (error, numberOfPoliticalRanks) => {
                        if (numberOfPoliticalRanks != 8)
                            done(new Error('There should be 8 political ranks, but there are ' + numberOfPoliticalRanks));
                        else
                            done();
                    });
                });

            });
        });
    });
});
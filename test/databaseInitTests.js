const initCards = require('../src/controllers/Mongo/init').initCards;
const CardModel = require('../src/models/CardModel/index');
const CardRankModel = require('../src/models/CardRankModel/index');
const SuitModel = require('../src/models/SuitModel/index');

describe('Initiallizing Database from scratch.', () => {

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
            let error;

            initCards().then(() => {
                CardModel.countDocuments({}, numberOfCards => {
                    if (numberOfCards != 52)
                        error = new Error('There should be 52 cards, but there are ' + numberOfCards);
                });
            })
            .catch(done)
            .finally(() => {
                if (error)
                    done(error);
                else
                    done();
            });
        });

        it('Check that calling initalize twice doesn\'t create duplicate instances', done => {
            let error;

            initCards().then(() => {
                CardModel.countDocuments({}, numberOfCards => {
                    if (numberOfCards != 52)
                        error = new Error('There should be 52 cards, but there are ' + numberOfCards);
                });
            })
            .catch(done)
            .finally(() => {
                if (error)
                    done(error);
                else
                    done();
            });
        });

    });

})
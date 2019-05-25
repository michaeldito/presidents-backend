const init = require('../src/controllers/Mongo/init');
const CardModel = require('../src/models/CardModel/index');
const CardRankModel = require('../src/models/CardRankModel/index');
const SuitModel = require('../src/models/SuitModel/index');
const PoliticalRankModel = require('../src/models/PoliticalRankModel/index');
const mongoose = require('mongoose');
const expect = require('expect');
require('dotenv').config();

describe('Initiallizing Database from scratch.', () => {

    before(async () => {
        const options = { useNewUrlParser: true, useCreateIndex: true };
        await mongoose.connect(process.env.MONGODB_URI_TEST, options);
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('InitCards()', () => {    
        
        before(async () => {
            await CardModel.deleteMany({});
            await CardRankModel.deleteMany({});
            await SuitModel.deleteMany({});
        });

        describe('Check that db collections are empty.', () => {

            it('No Card Ranks in DB', async () => {
                const count = await CardRankModel.countDocuments({});
                expect(count).toBe(0);
            });

            it('No Suits in DB', async () => {
                const count = await SuitModel.countDocuments({});
                expect(count).toBe(0);
            });

            it('No Cards in DB', async () => {
                const count = await CardModel.countDocuments({});
                expect(count).toBe(0);
            });

        });

        describe('Initializing Cards', () => {

            it('initializeCards()', async () => {
                await init.initCards();
                const count = await CardModel.countDocuments({});
                expect(count).toBe(52);
            });

            it('Check that calling initalize twice doesn\'t create duplicate instances', async () => {
                await init.initCards();
                const count = await CardModel.countDocuments({});
                expect(count).toBe(52);
            });

        });

    });

    describe('initPoliticalRanks()', () => {
        
        before(async () => {
            await PoliticalRankModel.deleteMany({});
        });

        describe('Check that db collections are empty.', () => {

            it('No Political Ranks in DB', async () => {
                const count = await PoliticalRankModel.countDocuments({});
                expect(count).toBe(0);
            });

        });

        describe('Initializing Political Ranks', () => {

            it('initializePoliticalRanks()', async () => {
                await init.initPoliticalRanks();
                const count = await PoliticalRankModel.countDocuments({});
                expect(count).toBe(8);
            });

            it('Check that calling initalize twice doesn\'t create duplicate instances', async () => {
                await init.initPoliticalRanks();
                const count = await PoliticalRankModel.countDocuments({});
                expect(count).toBe(8);
            });

        });

    });

});
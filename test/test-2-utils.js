const { CardRankModel, 
  SuitModel, PoliticalRankModel, 
  UserModel, PlayerModel, GameConfigModel, 
  GameModel } = require('../src/models');
const utils = require('../src/utils');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const assert = require('assert');
const connectToMongo = require('../src/config/db');

require('dotenv').config();


describe('Utility Tests', () => {

  before(async function() {
    await connectToMongo();
    await init.dropAll();
    await init.initPresidents();
  });

  after(async function() {
    await init.dropAll();
    await mongoose.connection.close();
  });




  describe('shuffle(deck)', () => {

    it('Shuffles 52 card object ids', async () => {
      const config = await GameConfigModel.findOne({name: 'Presidents'}).populate('deck');

      const shuffled = utils.shuffle(config.deck.cards);

      expect(shuffled.length).toBe(52);
      
      // how to test the shuffle? 
      // lets grab a few indexes and hope they dont match i guess
      expect(config.deck.cards[0]).not.toEqual(shuffled[0]);
      expect(config.deck.cards[25]).not.toEqual(shuffled[25]);
      expect(config.deck.cards[51]).not.toEqual(shuffled[51]);
    });

  });
 

  describe('deal(numPlayers=4, shuffledDeck)', () => {

    it('Creates a an array of length numPlayers each containing 13 cards', async () => {
      const config = await GameConfigModel.findOne({name: 'Presidents'}).populate('deck');

      const shuffled = utils.shuffle(config.deck.cards);
      const numPlayers = 4;
      const playerHands = utils.deal(numPlayers, shuffled);

      expect(playerHands).toHaveLength(4);
      playerHands.forEach(hand => expect(hand).toHaveLength(13));
    });

  });

  describe('sort(cards)', () => {

    it('Sorts an array of cards by rank', async () => {
      const config = await GameConfigModel.findOne({name: 'Presidents'}).populate('deck');

      const sorted = utils.sortCards(config.deck.cards);
      const ranks = sorted.map(card=> card.cardRank.value);

      // extract the first four items
      // check if they are equal to v, continue until v = 14 (Ace)
      let v = 2;
      while (v < 15) {
        let chunk = ranks.splice(0, 4);
        for (let peice of chunk) {
          expect(peice).toBe(v);
        }
        v++;
      }
    });

  });

  describe('find3Clubs(allPlayerHands)', () => {

    it('Searchs through a 2d array cards, returns index of array with 3♣', async () => {
      const config = await GameConfigModel.findOne({name: 'Presidents'}).populate('deck');

      const shuffled = utils.shuffle(config.deck.cards);
      const numPlayers = 4;
      const playerHands = utils.deal(numPlayers, shuffled);
      const res = utils.find3Clubs(playerHands);
      const card = playerHands[res.p][res.c];

      expect(card.shortHand).toBe('3Clubs');
    });

    it('Throws exception if 2d array does not contain 3♣', () => {
      const arr = [[{}],[{}],[{}]];
      assert.throws(() => utils.find3Clubs(arr), Error, '4 of Clubs was not in the deck.');
    });

  });
  

});
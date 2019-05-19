const mongoose = require('mongoose');
const SuitModel = require('./index');
const expect = require('expect');
require('dotenv').config();

describe('SuitModel', function() {

  // Before starting the test, connect to test db and clear all suits.
  before(function(done) {
    mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true });

    mongoose.connection.on('error', console.error.bind(console, 'connection error'));
    mongoose.connection.once('open', function() {
      // console.log('We are connected to test database!');
      SuitModel.deleteMany({}, done);
    });
  });

  describe('@init', function() {
    it('Should save 4 suits', function(done) {
      const suits = [
        {
          name: 'Clubs',
          color: 'Black',
          character: '\u2663',
          value: 0
        },
        {
          name: 'Diamonds',
          color: 'Red',
          character: '\u2666',
          value: 1
        },
        {
          name: 'Hearts',
          color: 'Red',
          character: '\u2665',
          value: 2
        },
        {
          name: 'Spades',
          color: 'Black',
          character: '\u2660',
          value: 3
        },
      ];

      let instances = suits.map(suit => new SuitModel(suit));
      let promises = instances.map(suit => suit.save());

      Promise.all(promises).then(function(result) { 
        expect(result.length).toBe(4);
      }).finally(done);
    });
  });

  describe('@getAll', function() {
    it('Should return 4 suits', function(done) {
      SuitModel.getAll(function(err, res, done) {
        expect(res.length).toBe(4);
        done();
      });
      done();
    });
  })
    
  // After all tests are finished clear the collection and close the connection.
  after(function(done) {
    SuitModel.deleteMany({}, function() {
      mongoose.connection.close(done);
    });
  });
  
});
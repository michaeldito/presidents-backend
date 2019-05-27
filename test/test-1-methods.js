const { CardModel, CardRankModel, 
  SuitModel, PoliticalRankModel, 
  UserModel, PlayerModel, GameModel,
  GameStateModel } = require('../src/models');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
require('dotenv').config();


describe.skip('Model Method Tests', () => {
    
  before(async () => {
    const options = { useNewUrlParser: true, useCreateIndex: true };
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
  });

  after(async () => {
    await mongoose.connection.close();
  });



  describe('Init DB', () => {    
    
    before(async () => {
      await CardModel.deleteMany({});
      await CardRankModel.deleteMany({});
      await SuitModel.deleteMany({});
      await init.initCards();
      await init.initPlayers();
      await init.initGame();
    });

    after(async () => {
      await CardModel.deleteMany({});
      await CardRankModel.deleteMany({});
      await SuitModel.deleteMany({});
    });

    it('should init db', () => {    
    
      const cards = CardModel.find({});
      const suits = SuitModel.find({});
      const ranks = CardRankModel.find({});
      const users = UserModel.find({});
      const games = GameModel.find({});

      expect(cards.length).toBe(52);
      expect(suits.length).toBe(4);
      expect(ranks.length).toBe(13);
      expect(users.length).toBe(9);
      expect(games.length).toBe(9);
    });

  });


  describe('CardRankModel', () => {    
    
    describe('getRankBy', () => {    
    
    });

  });


  describe('SuitModel', () => {    
    
    describe('', () => {    
    
    });

  });


  describe('GameStateModel', () => {    
    
    describe('findIdByValue(statusValue)', () => {    
    
      context('should return instance if successful', () => {    
    
        it('should return NOT_STARTED id', () => {    
    
        });

        it('should return IN_PROGRESS id', () => {    
    
        });

        it('should return FINALIZED id', () => {    
    
        });
      });

      it('should throw error if no instance found', () => {    
    
      });

    });

  });


  describe('PoliticalRankModel', () => {    
    
    describe('', () => {    
    
    });

  });


  describe('UserModel', () => {    
    
    describe('findByUsername(username)', () => {    
    
      it('should return instance if successful', () => {    
    
      });

      it('should throw error if no instance found', () => {    
    
      });

    });

  });


  describe('PlayerModel', () => {   
    
    describe('findAll()', () => {    
    
      it('should return all instances if successful', () => {    
    
      });

    });
    

    describe('findRandom()', () => {    
    
      it('should return instance if successful', () => {    
    
      });

      it('should throw error if no instance is found', () => {    
    
      });

    });


    describe('findRandoms(howMany)', () => {    
    
      it('should return instances if successful', () => {    
    
      });

      it('should throw error if no instances found', () => {    
    
      });

      it('should throw error if howMany instances not found', () => {    
    
      });
      
    });


    describe('findById()', () => {    
    
      it('should return instance if successful', () => {    
    
      });

      it('should throw error if no instance found', () => {    
    
      });
      
    });


    describe('findByUsername(username)', () => {    
    
      it('should return instance if successful', () => {    
    
      });

      it('should throw error if no instance found', () => {    
    
      });

    });


  });


  describe('GameModel', () => {  

    
    describe('findByName(name)', () => {    
    
      it('should return instance if successful', () => {    
    
      });

      it('should throw error if no instance found', () => {    
    
      });

    });


    describe('findByName(name)', () => {    
    
      it('should return instance if successful', () => {    
    
      });

      it('should throw error if no instance found', () => {    
    
      });

    });

  });
    

});

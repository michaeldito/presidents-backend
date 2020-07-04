const { init: initUsers, drop: dropUsers } = require('../../User/model/test');
const { init: initInviteStatuses, drop: dropInviteStatuses } = require('../../InviteStatus/model/test');
const { init: initGames, drop: dropGames } = require('../../Game/model/test');
const { init: initGameStatus, drop: dropGameStatus } = require('../../GameStatus/model/test');
const { init: initConfigs, drop: dropConfigs } = require('../../GameConfiguration/model/test');
const { init: initCardRanks, drop: dropCardRanks } = require('../../CardRank/model/test');
const { init: initSuits, drop: dropSuits } = require('../../Suit/model/test');
const { init: initCards, drop: dropCards } = require('../../Card/model/test');

const Invite = require('./');
const User = require('../../User');
const InviteStatus = require('../../InviteStatus');
const Game = require('../../Game');

const db = require('../../../config/db');
const expect = require('expect');
const mongoose = require('mongoose');


const init = async () => {

}

const drop = async () => {
}

const test = async () => describe('Invite', async function() {
    
  before(async function() {

  });

  after(async function() {

  });

  describe('#init()', async function() {    

  });

    
  describe('#drop()', async function() {    

  });
  
});

module.exports = { init, drop, test};
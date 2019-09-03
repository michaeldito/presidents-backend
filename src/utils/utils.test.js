
module.exports.utilTests = describe('Utility Tests', () => {

  before(async function() {
  });

  after(async function() {
  });



  describe('shuffle(deck)', () => {

    it('Shuffles 52 card object ids', async () => {

    });

  });
 

  describe('deal(numPlayers=4, shuffledDeck)', () => {

    it('Creates a an array of length numPlayers each containing 13 cards', async () => {

    });

  });

  describe('sort(cards)', () => {

    it('Sorts an array of cards by rank', async () => {
      // extract the first four items
      // check if they are equal to v, continue until v = 14 (Ace)
      // let v = 2;
      // while (v < 15) {
      //   let chunk = ranks.splice(0, 4);
      //   for (let peice of chunk) {
      //     expect(peice).toBe(v);
      //   }
      //   v++;
      // }
    });

  });

  describe('find3Clubs(allPlayerHands)', () => {

    it('Searchs through a 2d array cards, returns index of array with 3♣', async () => {

    });

    it('Throws exception if 2d array does not contain 3♣', () => {
      const arr = [[{}],[{}],[{}]];
      assert.throws(() => utils.find3Clubs(arr), Error, '4 of Clubs was not in the deck.');
    });

  });
  

});
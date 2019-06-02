const expect = require('expect');
const should = require('should');

describe.skip('Playground', () => {

  const globalVar = 'global';

  describe.skip('mocha.js', () => {

    describe('hooks', function() {

      before('before hook', function() {
        this.hookVar = 'beforeHookVar';
        console.log('before');
      });
  
      after('after hook', function() {
        this.hookVar = 'afterHookVar';
        console.log('after');
      });
  
      beforeEach('before each hook', function() {
        this.hookVar = 'beforeEachHookVar';
        console.log('before each');
      });
  
      afterEach('after each hook', function() {
        this.hookVar = 'afterEachHookVar';
        console.log('after each');
      });

      it('can access before hook variables placed on this', function() {
        expect(this.hookVar).toBe('beforeEachHookVar');
      });

      it('shows more hook logs', function() {
      });

    });


    describe('arrow functions', () => {

      before(function ArrowBeforeHook() {
      });

      it('this does not exist bc arrow function', () => {
        expect(this).toStrictEqual({});
      });

      it('can access global variable', () => {
        expect(globalVar).toBe('global');
      });

      it('can pass named function', arrowNamed = () => {
        expect(globalVar).toBe('global');
      });

      it('cannot grab hookVar from context', () => {
        expect(this.hookVar).toBe(undefined);
      });

    });

    describe('regular functions', function() {

      it('this exists', function() {
        expect(this).toBeTruthy();
      });

      it('can access global variable', () => {
        expect(globalVar).toBe('global');
      });

      it('can pass named function', function withName() {
      });

    });

    describe('accessing variables', function() {
      
      it('should access globalVar', function() {
        expect(globalVar).toBe('global');
      });

      it('should set a variable on the context', function() {
        this.testVar = 'test';
        expect(this.testVar).toBe('test');
      });
      
      it('should be able to access variable still', function() {
        expect(this.testVar).toBe('test');
      });

      it('should delete it from this', function() {
        delete this.testVar;
        expect(this.testVar).toBe(undefined);
      });
    });

    describe('skip', function() {

      it('calling skip inside test makes test pending', function() {
          this.skip();        
      });

    });

    describe('timeouts', function() {

      it('should print time in red', function(done) {
        setTimeout(done, 2000);
      });

      it('slow() tells mocha test is slow, so no red time', function(done) {
        this.slow(4000)
        setTimeout(done, 3000)    
      });

      it('should print time in red again', function(done) {
        setTimeout(done, 3000)    
      });

      describe('slow', function() {

        this.slow(4000)
        describe('should have yellow times', function() {

          it('calling slow() before suite applies to all tests in suite', function(done) {
            setTimeout(done, 2000);
          });

          it('calling slow() before suite applies to all tests in suite', function(done) {
            setTimeout(done, 2000);
          });

        });
  
      });

    });

    describe('it', function() {
      it('wrapping it blocks in an it block produces one result line', function() {
        it('a', function() {});
        it('b', function() {});
        it('c', function() {});
      });
    });

  });



  describe('should.js', function() {
    // should extends the Object.prototype with a single non-enumerable 
    // getter that allows you to express how that object should behave

    describe('how to invoke should', function() {

      it('chain - let\'s you chain for easy to read code', function() {
        const obj = {a:'a'};
        obj.should.an.of.a.and.be.have.with.is.which.property('a','a');
      });

      it('function call', function() {
        const obj = {a:'a'};
        should(obj).an.of.a.and.be.have.with.is.which.property('a','a');
      });

    });

    it('define custom assertion', function() {
      should.Assertion.add('asset', function() {
        this.params = { operator: 'to be asset' }
   
        this.obj.should.have.property('id').which.is.a.Number()
        this.obj.should.have.property('path')
      });
      const obj = {id:1, path:'/'};
      obj.should.have.asset();
    });

  });


});


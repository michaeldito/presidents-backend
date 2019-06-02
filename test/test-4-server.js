const app = require('../src/server');
const request = require('supertest');
const init = require('./Mongo/init');
const mongoose = require('mongoose');
const expect = require('expect');
const assert = require('assert');


describe.skip('Koa Server', () => {

  before(async () => {
    const options = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
    await mongoose.connect(process.env.MONGODB_URI_TEST, options);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  afterEach(() => {
    app.close();
  });

  
  describe('routes: /api/v1', () => {

    it('should respond with /api/v1', async () => {
      const response = await request(app).get('/api/v1');
      expect(response.status).toEqual(200);
      expect(response.type).toEqual('application/json');
      expect(response.body.data).toEqual('/api/v1');
    });

  });


  describe('routes: /api/v1/error', () => {

    it('koa should catch error', async () => {
      const response = await request(app).get('/api/v1/error');
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('Error Message');
    });

  });


  describe('routes: /api/v1/no-way', () => {

    it('koa event handling tests', async () => {
      const response = await request(app).get('/api/v1/no-way');
    });

  });


});
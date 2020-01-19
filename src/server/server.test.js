export default describe('Koa Server', function() {
	before(async function() {});

	after(async function() {});

	afterEach(function() {
		app.close();
	});

	describe('routes: /api/v1', function() {
		it('should respond with /api/v1', async function() {
			const response = await request(app).get('/api/v1');
			expect(response.status).toEqual(200);
			expect(response.type).toEqual('application/json');
			expect(response.body.data).toEqual('/api/v1');
		});
	});

	describe('routes: /api/v1/error', function() {
		it('koa should catch error', async function() {
			const response = await request(app).get('/api/v1/error');
			expect(response.status).toEqual(400);
			expect(response.text).toEqual('Error Message');
		});
	});

	describe('routes: /api/v1/no-way', function() {
		it('koa event handling tests', async function() {
			//const response = await request(app).get('/api/v1/no-way');
		});
	});
});

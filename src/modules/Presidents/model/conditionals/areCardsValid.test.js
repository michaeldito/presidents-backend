import expect from 'expect';

import Presidents from '..';
import Card from '../../';

export default async () =>
	describe('#areCardsValid()', function() {
		before(async function() {
			this.threeClubs = await Card.findOne({ shortHand: '3Clubs' });
			this.threeHearts = await Card.findOne({ shortHand: '3Hearts' });
			this.fourHearts = await Card.findOne({ shortHand: '4Hearts' });
		});

		describe('true', function() {
			it('cards are of the same rank', async function() {
				const cards = [this.threeClubs, this.threeHearts];
				const valid = Presidents.areCardsValid(cards);
				expect(valid).toBeTruthy();
			});
		});

		describe('false', function() {
			it('cards are not of the same rank', async function() {
				const cards = [this.threeClubs, this.fourHearts];
				const valid = Presidents.areCardsValid(cards);
				expect(valid).toBeFalsy();
			});
		});
	});

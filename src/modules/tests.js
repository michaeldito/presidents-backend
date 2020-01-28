import { test as cardTests } from './Card/model/test';
import { test as cardRankTests } from './CardRank/model/test';
import { test as gameTests } from './Game/model/test';
import { test as gameConfigTests } from './GameConfiguration/model/test';
import { test as gameStatusTests } from './GameStatus/model/test';
import { test as politicalRankTests } from './PoliticalRank/model/test';
import { test as presidentsTests } from './Presidents/model/test';
import { test as statusTests } from './Status/model/test';
import { test as suitTests } from './Suit/model/test';
import { test as userTests } from './User/model/test';

export const tests = {
	suitTests,
	cardRankTests,
	cardTests,
	gameConfigTests,
	politicalRankTests,
	statusTests,
	gameStatusTests,
	userTests,
	gameTests,
	presidentsTests,
};

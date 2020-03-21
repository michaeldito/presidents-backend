import Router from 'koa-router';

import Authenticate from '../../../middleware/Authenticate';
import { getAll, getOne } from '../controller';

const router = new Router({ prefix: '/gameConfigurations' });
router.get('/', Authenticate(['Admin', 'Player']), getAll);
router.get('/:id', Authenticate(['Admin']), getOne);

export default router;

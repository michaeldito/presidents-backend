import Router from 'koa-router';

import Authenticate from '../../../middleware/Authenticate';
import { getAll, getOne } from '../controller';

const router = new Router({ prefix: '/suits' });
router.get('/', Authenticate(['Admin']), getAll);
router.get('/:id', Authenticate(['Admin']), getOne);

export default router;

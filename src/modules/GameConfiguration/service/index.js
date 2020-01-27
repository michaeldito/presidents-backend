import Router from 'koa-router';

import Authenticate from '../../../middleware/Authenticate';
import VerifyJWT from '../../../middleware/VerifyJWT';
import { getAll, getOne } from '../controller';

const router = new Router({ prefix: '/gameConfigurations' });
router.use(VerifyJWT);
router.get('/', Authenticate(['Admin', 'Player']), getAll);
router.get('/:id', Authenticate(['Admin']), getOne);

export default router;

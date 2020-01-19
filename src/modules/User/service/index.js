import Router from 'koa-router';

import Authenticate from '../../../middleware/Authenticate';
// const VerifyJWT from '../../../middleware/VerifyJWT');
import { getAll, getOne, login, profile,register } from '../controller';

const router = new Router({ prefix: '/users' });
router.get('/', getAll);
router.get('/:id', Authenticate(['Admin', 'Player']), getOne);
router.get('/:id/profile', Authenticate(['Admin', 'Player']), profile);
router.put('/login', login);
router.post('/register', register);

export default router;

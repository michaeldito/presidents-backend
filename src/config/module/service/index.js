import Router from 'koa-router';

import Controller from '../controller';
const { getAll, getOne } = Controller;

const router = new Router({ prefix: '/model' });
router.get('/', getAll);
router.get('/:id', getOne);

export default router;

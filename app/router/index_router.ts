import express from 'express';
const router = express.Router();

import { user } from './user_router'

router.use('/user', user)

export {router}
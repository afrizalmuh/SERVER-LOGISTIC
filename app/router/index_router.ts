import express from 'express';
const router = express.Router();

import { user } from './user_router'
import { project } from './project_router';

router.use('/user', user)
router.use('/project', project)

export {router}
import express from 'express';
const user = express.Router();

import {
  create_user_controller, login_controller, logout_controller,
} from '../controller/user_controller'
import { auth_jwt } from '../middlewares/auth';

user.post('/create_user', create_user_controller)
user.post('/login_user', login_controller)
user.post('/logout_user', logout_controller)

export{ user }
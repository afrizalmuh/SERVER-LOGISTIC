import express from 'express'
const project = express.Router();
import { create_project_controller } from '../controller/project_controller';
import { auth_jwt } from '../middlewares/auth';

project.use('/create_project', auth_jwt, create_project_controller);

export { project }
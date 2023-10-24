import { Request, Response } from "express";
import moment from "moment";
import { create_project } from "../service/project_service";
import { createProject } from "../models/project_service_models";

const create_project_controller = async (req: Request, res: Response) => {
  let { name_project, user_id, description, status, start_project, end_project } = req.body
  try {

    

    let request_create_project: createProject = {
      user_id: user_id,
      name_project: name_project,
      description: description,
      status: status,
      start_project: start_project,
      end_project: end_project,
      created_on: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    let create_project_user = await create_project(request_create_project);
  } catch (err) {
    
  }
}


export { create_project_controller }
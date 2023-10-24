import { db } from "../config/database";
import { createProject } from "../models/project_service_models";

export const create_project = async (param: createProject) => {
  try {
    let result = await db('core.t_mtr_project').insert(param).returning('*')
    return {status:0, data:result}
  } catch (err) {
    return { status: 5445, message: (err as Error).message }
  }
}
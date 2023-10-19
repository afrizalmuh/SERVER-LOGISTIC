import { db } from "../config/database"
import { TypedReturnedService } from "../models/response_service"
import {
  searchUser,
  createUser,
  passwordUser,
  comparePassword,
  insertTokenJwt,
  insertDataLogin,
  checkUserLogin
} from "../models/user_service_models"
import bcrypt from 'bcrypt'

export const search_user = async (param: searchUser): Promise<TypedReturnedService> => {
  try {
    let { username } = param;
    let result = await db.select('t_mtr_user.username','t_mtr_user.fullname','t_mtr_user.password')
    .from('core.t_mtr_user')
    .where('t_mtr_user.username', username)
    return { status: 0, message: result} as TypedReturnedService
  } catch (err) {
    return { status: 5445, message: (err as Error).message } as TypedReturnedService
  }
}

export const encrypt = async (param: passwordUser): Promise<TypedReturnedService> => {
  try {
    const saltRounds = 10;
    let genSalt = await bcrypt.genSalt(saltRounds)
    let result = await bcrypt.hash(param.password, genSalt);
    return { status: 0, message: result }
  } catch (err) {
    return { status: 5665, data: (err as Error).message} as TypedReturnedService
  }
}

export const compare_password = async (param: comparePassword): Promise<TypedReturnedService> => {
  try {
    let { password_req, password_db } = param
    let result = await bcrypt.compare(password_req, password_db)
    return { status: 0, message: result}
  } catch (err) {
    return { status:1128,  message: (err as Error).message} as TypedReturnedService
  }
}

export const create_user = async (param: createUser): Promise<TypedReturnedService> => {
  try {
    let result = await db('core.t_mtr_user').insert(param).onConflict().ignore().returning('*')
    return { status: 0, data: result} as TypedReturnedService
  } catch (err) {
    return { status: 4386, data: (err as Error).message } as TypedReturnedService
  }
}

export const insert_token_jwt = async (param: insertTokenJwt): Promise<TypedReturnedService> => {
  try {
    let { username, token, current_on, expired_on } = param
    let result = await db('trx.t_trx_token_account').insert({
      username: username,
      token: token,
      created_on: current_on,
      expired_on: expired_on,
      active_status: 1
    }, ['e_token']).onConflict('username').merge({
      token: token,
      updated_on: current_on,
      expired_on: expired_on
    }).returning(['token']);
    return { status: 0, data: result}
  } catch (err) {
    return { status: 4638, data: (err as Error).message} as TypedReturnedService
  }
}

export const check_user_login = async (param: checkUserLogin): Promise<TypedReturnedService> => {
  try {
    let { username, last_login } = param
    let result = await db.raw(`select code, message from trx.sp_login_user('${username}','${last_login}')`)
    return {status:0, message:'Success', data: result.rows[0]}
  } catch (err) {
    return {status: 4817, data:(err as Error).message} as TypedReturnedService 
  }
}

export const insert_login = async (param: insertDataLogin): Promise<TypedReturnedService> => {
  try {
    let result = await db('trx.t_trx_login').insert(param).returning('*')
    return {status:0, data:result} as TypedReturnedService
  } catch (err) {
    return { status: 4638, data: (err as Error).message} as TypedReturnedService
  }
}

export const update_login = async (param: checkUserLogin): Promise<TypedReturnedService> => {
  try {
    let { username, last_login } = param
    let result = await db.raw(`
      UPDATE trx.t_trx_login as tb
      SET login_type = 
        CASE
          WHEN login_type = 1 THEN 2
          ELSE 1
        END
      WHERE tb.login_on::date = '${last_login}' and tb.username = '${username}'
      RETURNING *
    `)
    return {status:0, message:'Success', data:result.rows[0]}
  } catch (err) {
    return {status: 4817, data:(err as Error).message} as TypedReturnedService 
  }
}
import { Request, Response } from 'express'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import {
  search_user,
  create_user,
  encrypt,
  compare_password,
  insert_token_jwt,
  insert_login,
  check_user_login
} from "../service/user_service"
import {
  createUser, insertDataLogin
} from "../models/user_service_models"
import { TypedReturnedService } from '../models/response_service'
import { response_exception, response_normal } from '../config/response'
import { ResponseCreateUser, ResponseDataLogin } from '../models/user_controller_models'
import { TOKEN_SECRET } from '../config/secret'
import { generate } from 'randomstring'
import logger from '../config/logger'

const create_user_controller = async (req: Request, res: Response) => {
  let { fullname, username, email, password } = req.body;

  try {
    let user = await search_user({ username: username });
    if (user.status != 0) throw user
    if (user.message.length != 0) throw { status: 1, message: 'Username already exist' }

    let encyrpt_psw = await encrypt({ password: password });
    if (encyrpt_psw.status != 0) throw encyrpt_psw

    let data_create_user: createUser = {
      fullname: fullname,
      username: username,
      password: encyrpt_psw.message,
      email: email,
      created_on_dtm: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    logger.info(`REQ CREATE => ${JSON.stringify(data_create_user)}`) 
    
    let create_account_user = await create_user(data_create_user);
    if (create_account_user.status != 0) throw create_account_user

    let response_data : ResponseCreateUser = {
      fullname: create_account_user.data[0].fullname,
      username: create_account_user.data[0].username,
      email: create_account_user.data[0].email,
    }

    logger.info(`RES CREATE => ${JSON.stringify(response_data)}`)

    return response_normal({res:res, code:0, message:'SUKSES', data:response_data})
  } catch (err){
    var error = (err as TypedReturnedService);
    logger.error(`Error => ${JSON.stringify(error)}`)
    return response_exception({res:res, code:error.status, message:error.message})
  }
}

const login_controller = async (req: Request, res: Response) => {
  let { username, password } = req.body
  
  var current_date_text = moment().format('YYYYMMDDHHmmss')
  var unique_code = `${generate({length: 10, charset: 'alphanumeric'})}${current_date_text}`
  var current_date = moment().format('YYYY-MM-DD HH:mm:ss');
  var date_without_time = moment().format('YYYY-MM-DD');

  try {
    let user = await search_user({ username: username });

    if (user.status != 0) throw user
    if (user.message.length == 0) throw { status: 1, message: 'Username not found' }

    let psw = await compare_password({ password_req: password, password_db: user.message[0].password })
    if (psw.status != 0) throw psw
    if (!psw.message) throw { status: 1, message: 'Password does not same' }
    
    let token = jwt.sign({
      username: username,
      email: user.message[0].email
    }, TOKEN_SECRET.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    
    let expired_token = moment(moment().format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').add(24, 'hour').format('YYYY-MM-DD HH:mm:ss')
    
    let inputToken = await insert_token_jwt({ token: token, username: username, current_on: current_date, expired_on: expired_token })
    if (inputToken.status != 0) throw inputToken

    let check_login = await check_user_login({ username: username, last_login: date_without_time });
    console.log(check_login.data.code)
    let data_login: insertDataLogin;
    if (check_login.data.code === 0 || check_login.data.code === 1) {
      data_login = {
        username: user.message[0].username,
        fullname: user.message[0].fullname,
        login_type: 2,
        login_on: moment().format('YYYY-MM-DD HH:mm:ss'),
        status_code: '00',
        description: 'SUKSES',
        unique_code:unique_code
      }
    } else {
      return response_normal({res:res, code:4035, message:check_login.data.message})
    }
    // let data_login: insertDataLogin = {
    //   username: user.message[0].username,
    //   fullname: user.message[0].fullname,
    //   login_type: 1,
    //   login_on: moment().format('YYYY-MM-DD HH:mm:ss'),
    //   status_code: '00',
    //   description: 'SUKSES',
    //   unique_code:unique_code
    // }

    logger.info(`REQ LOGIN => ${JSON.stringify(data_login)}`)

    let insert_data_login = await insert_login(data_login);
    if (insert_data_login.status != 0) throw insert_data_login

    let response_login: ResponseDataLogin = {
      username: insert_data_login.data[0].username,
      token: inputToken.data[0].token
    }

    // logger.info(`RES LOGIN => ${JSON.stringify(response_login)}`)

    return response_normal({ res: res, code: 0, message:'SUKSES', data:response_login})

  } catch (err) {
    var error = (err as TypedReturnedService)
    logger.error(`Error => ${JSON.stringify(error)}`)
    return response_exception({res:res, code:error.status, message:error.message})
  }
}

const logout_controller = async(req:Request, res:Response) => {
  try {
    // let { username } = req.body
    let cek = {
      dek:'dek'
    }
    return response_normal({ res: res, code: 0, message:'SUKSES', data:cek})
  } catch (err) {
    var error = (err as TypedReturnedService)
    logger.error(`Error => ${JSON.stringify(error)}`)
    return response_exception({res:res, code:error.status, message:error.message})
  }
}

export{ create_user_controller, login_controller, logout_controller }
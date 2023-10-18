import { TypedReturnedService } from '../models/response_service'
import {
  ResponseMessageNormal,
  ResponseMessageQuery,
  ResponseMessageJwt,
  ResponseMessageBadRequest,
  ResponseMessageException
} from '../models/response_message'

export const response_normal = async (param: ResponseMessageNormal) => {
  let { res, code, message, data } = param;
  return res.status(200).json({
    code: code,
    message: message,
    data: data ?? {}
  }) 
}

export const response_exception = async (param: ResponseMessageException) => {
  let { res, code, message } = param
  return res.status(500).json({
    code: code,
    message: 'SISTEM SEDANG MENAGALAMI GANGGUAN',
    data: {
      error: message
    }
  })
}

export const response_jwt = async (param: ResponseMessageJwt) => {
  let { res, message } = param
  return res.status(401).json({
    code: 401,
    message: message,
    data: (param.data === undefined) ? {} : {
      error: param.data
    }
  })
}
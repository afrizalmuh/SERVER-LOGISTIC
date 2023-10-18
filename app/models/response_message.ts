import { Response } from 'express'

export interface ResponseMessageQuery {
  status_code: number,
  desc_ina: string
}

export interface ResponseMessageNormal {
  res: Response,
  code: number,
  message?: string,
  data?: object
}

export interface ResponseMessageJwt {
  res: Response,
  message: string,
  data?: string
}

export interface ResponseMessageException {
  res: Response,
  code: number,
  message?: any
}

export interface ResponseMessageBadRequest {
  res: Response,
  code: number,
  message?: any
}
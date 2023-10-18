import jwt from 'jsonwebtoken'
import { Response, Request, NextFunction } from 'express'
import { TOKEN_SECRET } from '../config/secret';
import { response_exception, response_jwt } from '../config/response';
import { TypedReturnedService } from '../models/response_service';

const auth_jwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let headers = req.headers.authorization;
    if (headers === null || headers === undefined) throw { status: 5138, message: "TOKEN IS REQUIRED!" }
    
    jwt.verify(headers.split(' ')[1], TOKEN_SECRET.ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err) {
        var err_type_name = "TokenExpiredError";
        if (err?.name.toLocaleLowerCase() === err_type_name.toLowerCase()) return response_jwt({ res: res, message: "TOKEN EXPIRED" })
        
        return response_jwt({res:res, message:"Unauthorized", data:err.message})
      }
      next();
    })
  } catch (err) {
    console.log('catch jwt')
    return response_exception({res: res, code: (err as TypedReturnedService).status, message: (err as TypedReturnedService).message});
  }
}

export {auth_jwt}
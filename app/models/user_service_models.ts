export interface createUser {
  fullname: string,
  username: string,
  email: string,
  password?: any,
  created_on_dtm: string
}

export interface insertDataLogin {
  username?: string,
  fullname?: string,
  login_type?: number,
  login_on?: string,
  status_code?: string,
  description?: string,
  unique_code?: string,

}

export interface searchUser {
  username: string
}

export interface checkUserLogin {
  username?: string
  last_login?: string
}

export interface passwordUser {
  password: any
}

export interface comparePassword {
  password_req: string,
  password_db: string
}

export interface insertTokenJwt {
  token: string,
  username: string,
  current_on: string,
  expired_on: string
}
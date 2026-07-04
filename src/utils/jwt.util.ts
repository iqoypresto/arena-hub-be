import jwt from "jsonwebtoken"
import { env } from "../config/env"
import { StringValue } from "ms"

export class JWTUtil {
    static signToken(payload: any){
        return jwt.sign({...payload}, env.JWT_SECRET as string, {expiresIn: env.JWT_EXPIRES_IN as StringValue})
    }
}
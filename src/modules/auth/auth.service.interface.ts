import { Request } from "express";
import { Session, SessionData } from "express-session";
import { AuthRequest } from "./auth.dto";
import { User } from "../user/entity/user.entity";

export interface IAuthService {
    validateUser(username: string, password: string): Promise<any>;
    register(requset: AuthRequest): Promise<any>;
    login(request: Request): Promise<any>;
    logout(request: Request): Promise<any>;
    getSession(idAccount: number): Promise<User>;
}

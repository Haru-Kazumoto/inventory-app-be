import { Request } from "express";
import { AuthRequest } from "./auth.dto";
import { User } from "../user/entities/user.entity";

export interface IAuthService {
    validateUser(username: string, password: string): Promise<any>;
    register(requset: AuthRequest): Promise<any>;
    login(request: Request): Promise<any>;
    logout(request: Request): Promise<any>;
    getSession(request: Request): Promise<User>;
}

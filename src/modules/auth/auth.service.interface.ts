import { Request } from "express";
import { AuthRequest } from "./auth.dto";
import { User } from "../user/entities/user.entity";
import { Req } from "@nestjs/common";

export interface IAuthService {
    validateUser(username: string, password: string): Promise<any>;
    register(requset: AuthRequest): Promise<any>;
    login(request: Request): Promise<any>;
    logout(request: Request): Promise<any>;
    getSession(): Promise<User>;
}

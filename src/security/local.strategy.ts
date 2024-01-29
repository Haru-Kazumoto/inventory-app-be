import { ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../modules/auth/auth.service";
import { RoleRepository } from "src/modules/role/repository/role.repository";
import { Roles } from "src/modules/role/entities/roles.entity";
import { DataNotFoundException } from "src/exceptions/data_not_found.exception";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private readonly roleRepository: RoleRepository
    ){
        super({
            usernameField: 'username'
        });
    }

    async validate(username: string, password: string):  Promise<any>{
        const user = await this.authService.validateUser(username, password);
        if(!user) {
            throw new ForbiddenException("Username or password isn't valid.");
        }
        return user;
    }

    async findRole(roleName: string): Promise<Roles>{
        const role = await this.roleRepository.findRoleByName(roleName);
        if(!role) throw new DataNotFoundException("Role not found.", 400);

        return role;
    }
}
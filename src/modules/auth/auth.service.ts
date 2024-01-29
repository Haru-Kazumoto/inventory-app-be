import { UserService } from 'src/modules/user/user.service';
import { ForbiddenException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth.service.interface';
import { User } from '../user/entities/user.entity';
import * as bcrypt from "bcrypt";
import { Request } from 'express';
import { AuthRequest } from './auth.dto';
import { Transactional } from 'typeorm-transactional';
import { UserRepository } from '../user/repository/user.repository';
import { comparePassword } from 'src/utils/password.utils';
import { RoleRepository } from '../role/repository/role.repository';
import { DataNotFoundException } from 'src/exceptions/data_not_found.exception';
import { UserUtils } from 'src/utils/modules_utils/user.utils';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Injectable()
export class AuthService implements IAuthService { 
    constructor(
        private userService: UserService,
        private readonly userRepsitory: UserRepository,
        private readonly roleRepository: RoleRepository,
        private userUtils: UserUtils
    ){}
    

    public async validateUser(username: string, password: string): Promise<any> {
        const user: User = await this.userService.findByUsername(username);
        const isPasswordMatch: boolean = await bcrypt.compare(password, user.password);

        if(user && isPasswordMatch){
            const {password, ...rest} = user;
            return rest;
        }
    }

    public async login(request: Request): Promise<any> {
        return {
            statusCode: HttpStatus.ACCEPTED,
            message: `Hello, ${request.body.username}`
        };
    }

    public async logout(request: Request): Promise<any> {
        request.session.destroy(() => {
            return {
                message: "Logout success",
                statusCode: HttpStatus.OK
            };
        });
    }

    getSession(request: Request): Express.User {
        return request.user;
    }

    @Transactional()
    public async register(request: AuthRequest): Promise<any> {
        this.userUtils.checkField('username', request.username, "Username already exists").isExists();

        const role = await this.roleRepository.findRoleById(request.role_id);

        if(!role) throw new DataNotFoundException("Role id not found.", 400);

        const createUser = this.userRepsitory.create({
            ...request,
            role: role,
            password: await bcrypt.hash(request.password, 10),
        });

        await this.userRepsitory.save(createUser); //ini ada error nih.
    }
}

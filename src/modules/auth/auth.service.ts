import { UserService } from '../../modules/user/user.service';
import { ForbiddenException, HttpStatus, Inject, Injectable, Req } from '@nestjs/common';
import { IAuthService } from './auth.service.interface';
import { User } from '../user/entities/user.entity';
import { Request } from 'express';
import { AuthRequest } from './auth.dto';
import { Transactional } from 'typeorm-transactional';
import { UserRepository } from '../user/repository/user.repository';
import { RoleRepository } from '../role/repository/role.repository';
import { DataNotFoundException } from '../../exceptions/data_not_found.exception';
import { UserUtils } from '../../utils/modules_utils/user.utils';

import * as bcrypt from "bcrypt";
import * as cls from "cls-hooked";

@Injectable()
export class AuthService implements IAuthService { 
    constructor(
        @Inject('USER_SERVICE') private userService: UserService,
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly userUtils: UserUtils
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
        setTimeout(() => {
            request.session.destroy(() => {
                return {
                    message: "Logout success",
                    statusCode: HttpStatus.OK
                };
            });
        }, 5000);
    }

    async getSession(): Promise<User> {
        const session = cls.getNamespace('session');
        const request = session.get('request');
        const user = request.user;

        const findSession = await this.userRepository.findById(user.id);

        return findSession;
    }

    @Transactional()
    public async register(request: AuthRequest): Promise<any> {
        this.userUtils.checkField('username', request.username, "Username already exists").isExists();

        const role = await this.roleRepository.findRoleById(request.role_id);

        if(!role) throw new DataNotFoundException("Role id not found.", 400);

        const createUser = this.userRepository.create({
            ...request,
            role: role,
            password: await bcrypt.hash(request.password, 10),
        });

        await this.userRepository.save(createUser); //ini ada error nih.
    }
}

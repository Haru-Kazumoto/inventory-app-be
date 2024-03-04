import { Injectable } from '@nestjs/common';
import { User, getSession } from './entities/user.entity';
import { UserCreateDto } from './dto/user.dto';
import { IUserService } from './user.service.interface';
import { Transactional } from 'typeorm-transactional/dist/decorators/transactional';
import { DataNotFoundException } from '../../exceptions/data_not_found.exception';
import { UserRepository } from './repository/user.repository';
import { UserUtils } from 'src/utils/modules_utils/user.utils';
import { RoleRepository } from '../role/repository/role.repository';
import { UnauthorizedException } from 'src/exceptions/unauthorized.exception';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { NotificationService } from '../notification/notification.service';
import { userCreateContent } from '../notification/notification.constant';
import { Request } from 'express';

import * as bcrypt from "bcrypt";
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService implements IUserService{

    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly notificationService: NotificationService,
        private readonly authService: AuthService,
        private userUtils: UserUtils
    ){}

    @Transactional()
    public async createUser(request: Request, body: UserCreateDto): Promise<User> {
        const user = await this.authService.getSession();
        
        await this
            .userUtils
            .checkField('username', body.username, 'Username telah terpakai')
            .isExists();

        const role = await this.roleRepository.findRoleById(body.role_id);
        const newUser = this.userRepository.create({
            ...body,
            role: role,
            password: await bcrypt.hash(body.password, 10)
        });

        //SEND NOTIFICATION
        await this.notificationService.sendNotification({
            title: "Pengguna baru",
            content: userCreateContent,
            color: "clay",
            user_id: user.id
        });

        return await this.userRepository.save(newUser);
    }

    public async findMany(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
        return this.userRepository.findMany(pageOptionsDto);
    }

    @Transactional()
    public async update(id: number, body: UserCreateDto): Promise<User> {
        const user = await this.userRepository.findById(id);
        if(!user) throw new DataNotFoundException("Id user not found", 400);

        this.userUtils.checkField('username', body.username, "Username sudah ada").isExists();

        user.username = body.username;

        Object.assign(user, body);

        return await this.userRepository.save(user);
    }

    public async hardDeleteById(id: number) {
        const data = await this.userRepository.findOne({where: {id: id}});
        if(!data) throw new DataNotFoundException("ID not found", 400);
        
        await this.userRepository.remove(data);
    }

    //BUG (hasMetadata) [TESTING]
    @Transactional()
    async softDeleteById(id: number): Promise<any> {
        const findId = await this.userRepository.findById(id);
        if(!findId) throw new DataNotFoundException("Id not found", 400);
        
        return await this.userRepository.softDelete(id);
    }

    //For Authentication
    public async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findUserByUsername(username);

        if(!user) throw new UnauthorizedException("Username or password is not valid", 401);

        return user;
    }

    public async findById(id: number): Promise<User> {
        const user =  await this.userRepository.findById(id);
        if(!user) throw new DataNotFoundException("Id user not found.", 400);

        return user;
    }

    public async findUserById(userId: number): Promise<User>{
        return await this.userRepository.findUserById(userId).then(
            () => { throw new DataNotFoundException("User not found", 400); }
        );
    } 
}

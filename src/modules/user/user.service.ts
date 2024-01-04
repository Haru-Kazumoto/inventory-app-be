import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserCreateDto } from './dto/user.dto';
import { DuplicateDataException } from '../../exceptions/duplicate_data.exception';
import * as bcrypt from "bcrypt";
import { IUserService } from './user.service.interface';
import { IPaginationOptions, IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Transactional } from 'typeorm-transactional/dist/decorators/transactional';
import { DataNotFoundException } from '../../exceptions/data_not_found.exception';
import { UserRepository } from './user.repository';
import { UserUtils } from 'src/utils/modules_utils/user.utils';

@Injectable()
export class UserService implements IUserService{

    constructor(
        private readonly userRepository: UserRepository,
        private userUtils: UserUtils
    ){}

    public async index(option: IPaginationOptions<IPaginationMeta>): Promise<Pagination<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.posts', 'posts')
            .orderBy('user.id', 'ASC');

        return await paginate<User>(queryBuilder, option);
    }

    @Transactional()
    public async update(id: number, body: UserCreateDto): Promise<User> {
        const user = await this.userRepository.findOne({where: {id: id}});
        if(!user) throw new DataNotFoundException("Id user not found", 404);

        this.userUtils.checkField('username', body.username, "Username already exists").isExists();

        user.username = body.username;
        user.password = await bcrypt.hash(body.password, 10);

        Object.assign(user, body);

        return await this.userRepository.save(user);
    }

    public async delete(id: number) {
        const data = await this.userRepository.findOne({where: {id: id}});
        if(!data) throw new DataNotFoundException("ID not found", 404);
        
        await this.userRepository.remove(data);
    }

    public async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findUserByUsername(username);

        if(!user) throw new DataNotFoundException("Username not found",400);

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

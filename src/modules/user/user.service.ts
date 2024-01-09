import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserCreateDto } from './dto/user.dto';
import { IUserService } from './user.service.interface';
import { IPaginationOptions, IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Transactional } from 'typeorm-transactional/dist/decorators/transactional';
import { DataNotFoundException } from '../../exceptions/data_not_found.exception';
import { UserRepository } from './user.repository';
import { UserUtils } from 'src/utils/modules_utils/user.utils';
import { RoleRepository } from '../role/role.repository';
import * as bcrypt from "bcrypt";
import { UnauthorizedException } from 'src/exceptions/unauthorized.exception';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/pagination.utils';

@Injectable()
export class UserService implements IUserService{

    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private userUtils: UserUtils
    ){}

    @Transactional()
    public async createUser(body: UserCreateDto): Promise<User>{
        await this.userUtils.checkField('username', body.username, 'Username telah terpakai').isExists();

        const role = await this.roleRepository.findRoleById(body.role_id);
        if(!role) throw new DataNotFoundException('Id role tidak ditemukan', 400);

        const createObject = this.userRepository.create({
            ...body,
            role: role,
            password: await bcrypt.hash(body.password, 15)
        });

        return await this.userRepository.save(createObject);
    }

    public async index(option: IPaginationOptions<IPaginationMeta>): Promise<Pagination<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.posts', 'posts')
            .orderBy('user.id', 'ASC');

        return await paginate<User>(queryBuilder, option);
    }

    public async findMany(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder("user");

        queryBuilder
            .orderBy("user.created_at", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const {entities} = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({itemCount, pageOptionsDto});

        return new PageDto(entities, pageMetaDto);
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

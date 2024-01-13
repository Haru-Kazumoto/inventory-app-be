import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from 'src/utils/modules_utils/pagination.utils';

@Injectable()
export class UserRepository extends Repository<User>{
    @InjectRepository(User) userRepository: Repository<User>

    constructor(public dataSource: DataSource){
        super(User, dataSource.createEntityManager());
    }

    async findUserByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({
            where: {
                username: username
            }
        });
    }

    async findMany(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
        return pagination<User>(this, pageOptionsDto, "user");
    }

    public async findById(id: number): Promise<User | undefined>{
        return await this.userRepository.findOne({
            where: {
                id: id
            },
            relations: {
                role: true
            }
        });
    }

    public async findUserById(userId: number):Promise<User | undefined>{
        return await this.userRepository.findOne({
            where: {
                id: userId
            },
            select: {
                id: true,
                username: true,
                role: {
                    id: true,
                    name: true,
                    major: true,
                    user: { id: true }
                }
            }
        })
    }
}

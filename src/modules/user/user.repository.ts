import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

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
            },
            relations: {
                role: {
                    access_path: true
                }
            }
        });
    }

    public async findById(id: number): Promise<User | undefined>{
        return await this.userRepository.findOne({
            where: {
                id: id
            },
            select: {
                password: false
            },
            relations: {
                role: {
                    access_path: true
                }
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
                    user: { id: true },
                    access_path: {
                        id: true,
                        path: true,
                        role: { id: true}
                    }
                }
            }
        })
    }
}

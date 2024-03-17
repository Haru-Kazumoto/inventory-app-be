import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { pagination } from '../../../utils/modules_utils/pagination.utils';
import { Roles } from '../../role/entities/roles.entity';

@Injectable()
export class UserRepository extends Repository<User>{

    // constructor(public dataSource: DataSource){
    //     super(User, dataSource.createEntityManager());
    // }

    async findUserByUsername(username: string): Promise<User> {
        return await this.findOne({
            where: {
                username: username
            }
        });
    }

    async findUserByRole(role: "SUPERADMIN" | "ADMIN"): Promise<User[]>{
        return this.createQueryBuilder("user")
            .where("user.role.name = :role", {role})
            .getMany();
    }

    async softDeleteById(id: number) {
        const query = this.createQueryBuilder("role");

        await query
            .softDelete()
            .from(Roles)
            .where("role.id = :id", {id: id})
            .execute();
    }

    async findMany(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
        return pagination<User>(this, pageOptionsDto, "user");
    }

    public async findById(id: number): Promise<User | undefined>{
        return await this.findOne({
            where: {
                id: id
            },
            relations: {
                role: true
            }
        });
    }

    public async findUserById(userId: number):Promise<User | undefined>{
        return await this.findOne({
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

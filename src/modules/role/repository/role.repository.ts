import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Roles } from "../entities/roles.entity";
import { InjectRepository } from "@nestjs/typeorm";
import dataSource from "src/db/data-source";

@Injectable()
export class RoleRepository extends Repository<Roles>{

    constructor(public dataSource: DataSource){
        super(Roles, dataSource.createEntityManager());
    }

    // public async findRoleByName(name: string): Promise<Roles | undefined>{
    //     const queryRunner = this.dataSource.createQueryRunner();
    //     const queryBuilder = this.dataSource.createQueryBuilder(queryRunner);

    //     return queryBuilder.where({
            
    //     });
    // }

    // public async findRole(role: "ADMIN" | "SUPERADMIN"): Promise<Roles[] | any>{
    //     return this.createQueryBuilder("role")
    //         .where("role.name = :role ", {role})
    //         .getMany();
    // }

    // public async findAllRoles(): Promise<Roles[]>{
    //     return await this.roleRepository.find({
    //         select: {
    //             name: true,
    //             major: true
    //         }
    //     });
    // }    

    public async findRoleById(id: number): Promise<Roles>{
        return this.createQueryBuilder("role")
            .where("role.id = :id", {id})
            .getOne();
    }
}
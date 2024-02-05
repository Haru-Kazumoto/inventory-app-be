import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Roles } from "../entities/roles.entity";

@Injectable()
export class RoleRepository extends Repository<Roles>{

    constructor(public dataSource: DataSource){
        super(Roles, dataSource.createEntityManager());
    }

    public async findRoleByName(name: string): Promise<Roles | undefined>{
        return await this.findOne({
            where:{
                name: name
            }
        });
    }

    public async findRole(role: "ADMIN" | "SUPERADMIN"): Promise<Roles[] | any>{
        return this.createQueryBuilder("role")
            .where("role.name = :role ", {role})
            .getMany();
    }

    public async findAllRoles(): Promise<Roles[]>{
        return await this.find({
            select: {
                name: true,
                major: true
            }
        });
    }    

    public async findRoleById(id: number): Promise<Roles>{
        return await this.findOne({
            where: {
                id: id
            }
        });
    }
}
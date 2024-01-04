import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AccessPaths } from "./roles.access.entity";

@Injectable()
export class AccessRolesRepository extends Repository<AccessPaths> {
    constructor(private readonly dataSource: DataSource){
        super(AccessPaths, dataSource.createEntityManager());
    }

}
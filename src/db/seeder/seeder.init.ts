import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { AccessPaths } from 'src/modules/access_roles/roles.access.entity';
import { Roles } from 'src/modules/role/roles.entity';
import { User } from 'src/modules/user/user.entity';
import { Repository } from 'typeorm';
import { TransactionalError } from 'typeorm-transactional';

import * as bcrypt from "bcrypt";

@Injectable()
export class InitSeeder implements Seeder {

    constructor(
        @InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>,
        @InjectRepository(AccessPaths) private readonly accessPathsRepository: Repository<AccessPaths>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}

    async seed(): Promise<any> {
        await this.seedRole();
        await this.seedUser();
    }

    async seedRole(): Promise<any>{
        try{
            const rolesData = [
                {
                    name: 'ADMIN_TJKT',
                    major: 'TJKT'
                },
                {
                    name: 'ADMIN_TO',
                    major: 'TO'
                },
                {
                    name: 'ADMIN_TE',
                    major: 'TE'
                },
                {
                    name: 'ADMIN_AKL',
                    major: 'AKL'
                },
                {
                    name: 'SUPERADMIN',
                    major: 'SUPERADMIN'
                }
            ];
    
            const savedRoles = await Promise.all(
                rolesData.map(roleData => this.rolesRepository.save(this.rolesRepository.create(roleData)))
              );
    
            const access_paths = [];
    
            for (const { path, role } of access_paths) {
                const foundRole = savedRoles.find(savedRole => savedRole.name === role.name);
                if (foundRole) {
                  const accessPath = this.accessPathsRepository.create({
                    path,
                    role: foundRole,
                  });
                  await this.accessPathsRepository.save(accessPath);
                }
              }

        } catch(err) {
            if(err instanceof TransactionalError){
                Logger.log("Seeding data failed.", "SEEDER");
                throw new TransactionalError("Error seeding data.");
            }
        }
    }

    async seedUser(): Promise<any>{
        const super_admin_role = await this.rolesRepository.findOne({where: {id: 5}});
        const user = this.userRepository.create({
            name: "Haru Kazumoto",
            username: "haru",
            password: await bcrypt.hash("1234", 10),
            role_id: 5,
            role: super_admin_role
        });

        await this.userRepository.save(user);

    }

    async drop(): Promise<any> {
        await this.rolesRepository.delete({});
        await this.accessPathsRepository.delete({});

        Logger.log("Database has dropped", "SEEDER");
    }

}

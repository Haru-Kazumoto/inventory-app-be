import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Roles } from 'src/modules/role/entities/roles.entity';
import { Repository } from 'typeorm';
import { TransactionalError } from 'typeorm-transactional';

@Injectable()
export class RoleSeeder implements Seeder {

    constructor(
        @InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>
    ){}

    async seed(): Promise<any> {
        await this.seedRole();
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
    
            await Promise.all(
                rolesData.map(roleData => this.rolesRepository.save(
                    this.rolesRepository.create(roleData))
                )
            );

            Logger.log(`[ROLE] Seeder succcess with data : ${await this.rolesRepository.count()}`, "SEEDER")

        } catch(err) {
            if(err instanceof TransactionalError){
                Logger.log("Seeding data failed.", "SEEDER");
                throw new TransactionalError("Error seeding data.");
            }
        }
    }

    async drop(): Promise<any> {
        await this.rolesRepository.delete({});

        Logger.log("[ROLE] Data has dropped.", "SEEDER");
    }    
}

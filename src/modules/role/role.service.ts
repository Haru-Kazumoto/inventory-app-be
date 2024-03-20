import { Inject, Injectable } from '@nestjs/common';
import { IRoleService } from './role.interface';
import { RoleCreateDto } from './dto/role.dto';
import { Roles } from './entities/roles.entity';
import { RoleRepository } from './repository/role.repository';
import { Transactional } from 'typeorm-transactional';
import { DuplicateDataException } from '../../exceptions/duplicate_data.exception';

@Injectable()
export class RoleService implements IRoleService{

    constructor(
        private readonly roleRepository: RoleRepository
    ){}

    @Transactional()
    public async createRole(requestBody: RoleCreateDto): Promise<Roles> {
        await this.checkRoleNameIsExists(requestBody.name);

        const role = this.roleRepository.create({
            name: requestBody.name,
            major: ""
        });

        const savedRole = await this.roleRepository.save(role);

        return savedRole;
    }

    public async indexRole(): Promise<Roles[]> {
        return await this.roleRepository.find({});
    }

    updateRole(id: number, requestBody: RoleCreateDto): Promise<Roles> {
        throw new Error('Method not implemented.');
    }

    deleteRole(id: number): Promise<void> {
        throw new Error('Method not implemented.');
    }

    // UTILS METHOD

    private async checkRoleNameIsExists(nameToCheck: string): Promise<Roles>{
        const isNameIsExists = await this.roleRepository.findOne({
            where: {
                name: nameToCheck
            }
        });
        if(isNameIsExists) throw new DuplicateDataException("Role name has already register");

        return isNameIsExists;
    }

}

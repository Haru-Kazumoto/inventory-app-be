import { Inject, Injectable } from '@nestjs/common';
import { IRoleService } from './role.interface';
import { RoleCreateDto } from './dto/role.dto';
import { Roles } from './roles.entity';
import { RoleRepository } from './role.repository';
import { Transactional } from 'typeorm-transactional';
import { AccessRolesRepository } from '../access_roles/roles.access.repository';
import { DuplicateDataException } from 'src/exceptions/duplicate_data.exception';

@Injectable()
export class RoleService implements IRoleService{

    constructor(
        private readonly roleRepository: RoleRepository,
        private readonly accessRoleRepository: AccessRolesRepository
    ){}

    @Transactional()
    public async createRole(requestBody: RoleCreateDto): Promise<Roles> {
        await this.checkRoleNameIsExists(requestBody.name);

        const accessPaths = this.accessRoleRepository.create({
            path: requestBody.access_path.path
        });

        const savedAccessPaths = await this.accessRoleRepository.save(accessPaths);

        const role = this.roleRepository.create({
            name: requestBody.name,
            major: "",
            access_path: [savedAccessPaths]
        });

        const savedRole = await this.roleRepository.save(role);

        return savedRole;
    }

    public async indexRole(): Promise<Roles[]> {
        return await this.roleRepository.findAllRoles();
    }

    updateRole(id: number, requestBody: RoleCreateDto): Promise<Roles> {
        throw new Error('Method not implemented.');
    }

    deleteRole(id: number): Promise<void> {
        throw new Error('Method not implemented.');
    }

    // UTILS METHOD

    private async checkRoleNameIsExists(nameToCheck: string): Promise<Roles>{
        const isNameIsExists = await this.roleRepository.findRoleByName(nameToCheck);
        if(isNameIsExists) throw new DuplicateDataException("Role name has already register");

        return isNameIsExists;
    }

}

import { RoleCreateDto } from "./dto/role.dto";
import { Roles } from "./entities/roles.entity";

export interface IRoleService {
    createRole(requestBody: RoleCreateDto): Promise<Roles>;
    indexRole(): Promise<Roles[]>;
    updateRole(id: number, requestBody: RoleCreateDto): Promise<Roles>;
    deleteRole(id: number): Promise<void>;
}
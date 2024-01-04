import { IsArray, IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { AccessPaths } from "../../access_roles/roles.access.entity";
import { AccessPathsCreateDto } from "src/modules/access_roles/dto/role.access.dto";

export class RoleCreateDto {
    
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    @IsArray()
    public description: string;

    @IsNotEmpty()
    public access_path: AccessPathsCreateDto;

}
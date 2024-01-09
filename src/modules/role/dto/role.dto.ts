import { IsArray, IsNotEmpty } from "class-validator";

export class RoleCreateDto {
    
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    @IsArray()
    public major: string;

}
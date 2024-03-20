import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class RoleCreateDto {
    
    @ApiProperty({example: "ADMIN_TJKT"})
    @IsNotEmpty()
    public name: string;

    @ApiProperty({example: "TJKT"})
    @IsNotEmpty()
    public major: string;

}
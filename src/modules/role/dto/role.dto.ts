import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class RoleCreateDto {
    
    @ApiProperty({example: "LAB - 1"})
    @IsNotEmpty()
    public name: string;

    @ApiProperty({example: "TJKT"})
    @IsNotEmpty()
    @IsArray()
    public major: string;

}
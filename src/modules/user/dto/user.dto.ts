import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class UserCreateDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "Haru Kazumoto",
        required: true,
        description: "For admin name that shown in UI"
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: "haruKazumoto",
        required: true,
        description: "Username account credential"
    })
    username: string;
    
    @IsNotEmpty()
    @ApiProperty({
        example: "haru123",
        required: true,
        description: "Password credential (it will be hashed)"
    })
    password: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 1,
        required: true,
        description: "[1: ADMIN_TJKT, 2: ADMIN_TO, 3: ADMIN_TE, 4: ADMIN_AK, 5: SUPERADMIN]"
    })
    role_id: number;
    
}
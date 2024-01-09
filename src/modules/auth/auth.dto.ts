import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthDto {
    
}

export class AuthRequest {
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
        description: "The system will find role id and set it to 'role' relations"
    })
    role_id: number;
}

export class AuthLogin {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}
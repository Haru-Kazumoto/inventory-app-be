import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthDto {
    
}

export class AuthRequest {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNumber()
    @IsNotEmpty()
    role_id: number;
}
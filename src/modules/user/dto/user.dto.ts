import { IsNotEmpty, IsEmail } from "class-validator";

export class UserCreateDto {
    @IsNotEmpty()
    username: string;
    
    @IsNotEmpty()
    password: string;

    

}
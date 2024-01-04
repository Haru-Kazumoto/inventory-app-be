import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class AccessPathsCreateDto{

    @IsNotEmpty()
    @IsString()
    public path: string;
    
}
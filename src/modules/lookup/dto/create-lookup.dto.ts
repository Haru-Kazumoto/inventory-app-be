import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { LookupType } from "../enums/lookup-type.enum";

export class CreateLookupDto {
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsEnum({LookupType})
    @IsNotEmpty()
    public type: LookupType

    @IsString()
    @IsNotEmpty()
    public value: string;        
}

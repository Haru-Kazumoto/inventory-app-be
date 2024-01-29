import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateNotificationDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public content: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public color?: string | null;
    
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    public hasRead?: boolean;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    public user_id: number;    

}

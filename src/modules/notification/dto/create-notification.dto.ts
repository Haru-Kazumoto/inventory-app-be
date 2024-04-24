import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {

    @IsString()
    @IsOptional()
    @ApiProperty()
    public title?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public content: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    public color?: string | null;
    
    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    public hasRead?: boolean;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    public user_id: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    public toSuperadmin?: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty()
    public superadmin_content?: string;
}

export class SendToSuperadmin {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    has_read?: boolean;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    superadmin_id: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public name: string; //items name

    @IsString()
    @IsNotEmpty()
    @Matches('/^[A-Za-z]{3}|[A-Za-z0-9]{5}-[A-Za-z0-9]+$/',null,{
        message: "Kode item harus diawali dengan 3 sampai 5 huruf lalu di akhiri dengan random teks."
    })
    @ApiProperty({example: "MKT-3476U923LL"})
    public item_code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public status_item: string; //lookup type STATUS

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public category_item: string; //lookup type CATEGOTRY harusnya kategory nya itu habis pakai dan tidak

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    public class_id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    public total_current: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public item_type: string; //lookup type TYPE harusnya ATK dan NON ATK
}

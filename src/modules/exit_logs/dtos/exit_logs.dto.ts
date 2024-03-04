import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ItemCategory } from "src/enums/item_category.enum";
import { ItemDetails } from "src/modules/item_details/entities/item_details.entity";

export class CreateExitLogDto {
    @ApiProperty({example: "Haru Kazumoto"})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: "088976972688"})
    @IsNumber()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({example: "X TKJ 4"})
    @IsString()
    @IsNotEmpty()
    major_class: string;

    @ApiProperty({example: ItemCategory.BARANG_HABIS_PAKAI})
    @IsEnum(ItemCategory)
    @IsNotEmpty()
    item_category: ItemCategory;

    @ApiProperty({example: 10})
    @IsNumber()
    @IsNotEmpty()
    total: number;

    @ApiProperty({type: [ItemDetails],example: [{item_id: 1,exit_log_id: 1},{item_id: 1,exit_log_id: 2}]})
    @IsArray()
    @IsNotEmpty()
    item_details: ItemDetails[];
}
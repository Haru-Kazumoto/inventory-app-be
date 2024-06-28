import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { ItemCategory } from "src/enums/item_category.enum";
import { ItemType } from "src/enums/item_type.enum";
import { StatusItem } from "src/enums/status_item.enum";

export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "Mikrotik"})
    public name: string; //items name

    @IsString()
    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty({example: "MKT-123456789"})
    public item_code?: string;

    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty({example: "BOSDA"})
    // public source_fund: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(ItemCategory)
    @ApiProperty({example: ItemCategory.BARANG_HABIS_PAKAI})
    public category_item: ItemCategory;

    // @IsNotEmpty()
    @IsOptional()
    @ApiProperty({example: "1 PACK / 1 PCS"})
    public total_unit?: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example: 1000000})
    @Transform(({ value }) => parseInt(value, 10)) // Mengonversi string ke number
    public unit_price: number;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10)) // Mengonversi string ke number
    @ApiProperty({example: 1})
    public class_id: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum(ItemType)
    @ApiProperty({example: ItemType.NON_ATK})
    public item_type: ItemType; 
}

export class CreateItemDtoWithFile extends CreateItemDto {
    @ApiProperty({type: 'string', format: 'binary', required: true})
    public item_image: any;
}
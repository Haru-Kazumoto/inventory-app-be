import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ItemCategory } from "src/enums/item_category.enum";

export class CreateItemDetailsDto {
    @ApiProperty({example: 1})
    @IsNumber()
    @IsNotEmpty()
    public item_id: number;

    @ApiProperty({example: ItemCategory.BARANG_HABIS_PAKAI})
    @IsEnum(ItemCategory)
    public category_item?: ItemCategory;

    @ApiProperty({example: 5})
    @IsNumber()
    public total_exit_item?: number;
}
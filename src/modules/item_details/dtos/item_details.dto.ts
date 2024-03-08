import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateItemDetailsDto {
    @ApiProperty({example: 1})
    @IsNumber()
    @IsNotEmpty()
    public item_id: number;
}
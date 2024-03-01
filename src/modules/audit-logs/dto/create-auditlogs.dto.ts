import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { EditMethod } from "src/enums/edit_methods.enum";

export class CreateAuditLogsDto {
    @ApiProperty({description: "this record was edited by", example: 1})
    @IsNumber()
    @IsNotEmpty()
    edited_by: number;

    @ApiProperty({description: "Edit method", example: EditMethod.CREATE})
    @IsEnum(EditMethod)
    @IsNotEmpty()
    edit_method: EditMethod;

    @ApiProperty({description: "Item id for relation", example: 1})
    @IsNumber()
    @IsNotEmpty()
    item_id: number;
}
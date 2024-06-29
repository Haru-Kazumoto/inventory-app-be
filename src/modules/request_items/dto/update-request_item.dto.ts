import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { RequestStatus } from 'src/enums/request_status.enum';

export class UpdateRequestItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Mikrotik' })
  public item_name: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // Mengonversi string ke number
  @ApiProperty({ example: 10 })
  public total_request: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Kekurangan Unit' })
  public description: string;
  
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // Mengonversi string ke number
  @ApiProperty({ example: 1 })
  public class_id: number;
}

export class UpdateRequestItemDtoWithFile extends UpdateRequestItemDto{
  @ApiProperty({type: 'string', format: 'binary', required: true})
  public request_image: any;
}

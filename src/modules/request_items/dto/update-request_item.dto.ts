import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 10 })
  public total_request: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Kekurangan Unit' })
  public description: string;
  
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  public class_id: number;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Major } from 'src/enums/majors.enum';

export class UpdateClassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'LAB - 1',
    required: true,
    description: 'For class name',
  })
  class_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'TJKT',
    required: true,
    description: 'For major',
  })
  major: Major;
}
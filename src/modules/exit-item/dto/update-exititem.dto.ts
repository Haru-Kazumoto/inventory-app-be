import { PartialType } from '@nestjs/mapped-types';
import { CreateExititemDto } from './create-exititem.dto';

export class UpdateExititemDto extends PartialType(CreateExititemDto) {}

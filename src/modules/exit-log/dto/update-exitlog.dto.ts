import { PartialType } from '@nestjs/mapped-types';
import { CreateExitlogDto } from './create-exitlog.dto';

export class UpdateExitlogDto extends PartialType(CreateExitlogDto) {}

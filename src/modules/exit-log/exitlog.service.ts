import { Injectable } from '@nestjs/common';
import { CreateExitlogDto } from './dto/create-exitlog.dto';
import { UpdateExitlogDto } from './dto/update-exitlog.dto';

@Injectable()
export class ExitlogService {
  create(createExitlogDto: CreateExitlogDto) {
    return 'This action adds a new exitlog';
  }

  findAll() {
    return `This action returns all exitlog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exitlog`;
  }

  update(id: number, updateExitlogDto: UpdateExitlogDto) {
    return `This action updates a #${id} exitlog`;
  }

  remove(id: number) {
    return `This action removes a #${id} exitlog`;
  }
}

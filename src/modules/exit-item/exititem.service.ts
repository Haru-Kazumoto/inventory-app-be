import { Injectable } from '@nestjs/common';
import { CreateExititemDto } from './dto/create-exititem.dto';
import { UpdateExititemDto } from './dto/update-exititem.dto';

@Injectable()
export class ExititemService {
  create(createExititemDto: CreateExititemDto) {
    return 'This action adds a new exititem';
  }

  findAll() {
    return `This action returns all exititem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exititem`;
  }

  update(id: number, updateExititemDto: UpdateExititemDto) {
    return `This action updates a #${id} exititem`;
  }

  remove(id: number) {
    return `This action removes a #${id} exititem`;
  }
}

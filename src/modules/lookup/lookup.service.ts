import { Injectable } from '@nestjs/common';
import { CreateLookupDto } from './dto/create-lookup.dto';
import { UpdateLookupDto } from './dto/update-lookup.dto';

@Injectable()
export class LookupService {
  create(createLookupDto: CreateLookupDto) {
    return 'This action adds a new lookup';
  }

  findAll() {
    return `This action returns all lookup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lookup`;
  }

  update(id: number, updateLookupDto: UpdateLookupDto) {
    return `This action updates a #${id} lookup`;
  }

  remove(id: number) {
    return `This action removes a #${id} lookup`;
  }
}

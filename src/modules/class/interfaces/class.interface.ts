import { CreateClassDto, UpdateClassDto } from '../dto/class.dto';
import { Class } from '../entitites/class.entity';

export interface IClassService {
  createOne(body: CreateClassDto): void;
  findMany(): Promise<Class[]>;
  findById(id: number): void;
  deleteById(id: number): void;
  updateOne(id: number, body: UpdateClassDto): void;
}

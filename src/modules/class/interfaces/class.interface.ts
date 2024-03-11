import { CreateClassDto } from '../dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { Class } from '../entitites/class.entity';

export interface IClassService {
  createOne(body: CreateClassDto): void;
  findMany(): Promise<Class[]>;
  findById(id: number): void;
  deleteById(id: number): void;
  updateOne(id: number, body: UpdateClassDto): void;
}

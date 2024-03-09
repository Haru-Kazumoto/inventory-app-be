import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataNotFoundException } from 'src/exceptions/data_not_found.exception';
import { DuplicateDataException } from 'src/exceptions/duplicate_data.exception';
import { Class } from 'src/modules/class/entitites/class.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserUtils {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  public checkField(
    field: string,
    value: any,
    errorMessage: string,
  ): FieldChecker {
    return new FieldChecker(this.repository, field, value, errorMessage);
  }
}

// @Injectable()
// export class ClassUtils {
//   constructor(
//     @InjectRepository(Class) private readonly repository: Repository<Class>,
//   ) {}

//   public checkField(
//     field: string,
//     value: any,
//     errorMessage: string,
//   ): FieldChecker {
//     return new FieldChecker(this.repository, field, value, errorMessage);
//   }
// }

class FieldChecker {
  private isExistsFlag: boolean = false;

  constructor(
    private userRepository: Repository<User>,
    private field: string,
    private value: any,
    private errorMessage: string,
  ) {}

  public async isExists(): Promise<void> {
    const data = await this.userRepository.findOne({
      where: { [this.field]: this.value },
    });
    if (data) {
      this.isExistsFlag = true;
      throw new DuplicateDataException(this.errorMessage, 400);
    }
  }

  public async isNotExist(): Promise<void> {
    if (!this.isExistsFlag) {
      const data = await this.userRepository.findOne({
        where: { [this.field]: this.value },
      });
      if (!data) {
        throw new DataNotFoundException(this.errorMessage, 400);
      }
    }
  }
}

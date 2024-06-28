import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { TransactionalError } from 'typeorm-transactional';
import * as bcrypt from "bcrypt";
import { Roles } from 'src/modules/role/entities/roles.entity';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>
  ) {}

  async seed(): Promise<any> {
    await this.seedUser();
  }

  async seedUser(): Promise<any> {
    try {
      const roleId: number = 5;
      const role: Roles = await this.roleRepository.findOne({where: {id: roleId}});

      await this.userRepository.save({
          name: 'superadmin',
          username: 'superadmin',
          password: bcrypt.hashSync("12345", 15),
          role_id: roleId,
          role: role
      });

      Logger.log(
        `[USER] Seeder success with data : ${await this.userRepository.count()}`,
        'SEEDER',
      );
    } catch (err) {
      if (err instanceof TransactionalError) {
        Logger.log('Seeding data failed.', 'SEEDER');
        throw new TransactionalError('Error seeding data.');
      }
    }
  }

  // async seedUsers(): Promise<User[]> {
  //   const ADMIN_TJKT: number = 1;
  //   const ADMIN_TO: number = 2;
  //   const ADMIN_TE: number = 3;
  //   const ADMIN_AK: number = 6;
  //   const SUPERADMIN_ROLE: number = 4;
  //   const STORE_ROLE: number = 5;

    
  //   try {    
  //     const roles: Roles[];

  //     const admin_tjkt: Roles = await this.roleRepository.findOne({where: {id: ADMIN_TJKT}});
  //     const admin_to: Roles = await this.roleRepository.findOne({where: {id: ADMIN_TO}});
  //     const admin_te: Roles = await this.roleRepository.findOne({where: {id: ADMIN_TE}});
  //     const admin_ak: Roles = await this.roleRepository.findOne({where: {id: ADMIN_AK}});
  //     const superadmin: Roles = await this.roleRepository.findOne({where: {id: SUPERADMIN_ROLE}});
  //     const store: Roles = await this.roleRepository.findOne({where: {id: STORE_ROLE}});
      
  //     roles.push(admin_tjkt, admin_to, admin_te, admin_ak, superadmin, store);

  //     await this.userRepository.save(
  //       {
  //         name: 'superadmin',
  //         username: 'superadmin',
  //         password: bcrypt.hashSync("12345", 15),
  //         role_id: SUPERADMIN_ROLE,
  //         role: superadmin
  //       },
  //       {
  //         name: 'admin TJKT',
  //         username: 'admin_tjkt',
  //         password: bcrypt.hashSync("12345", 15),
  //         role_id: ADMIN_TJKT,
  //         role: admin_tjkt
  //       }
  //     );
      

  //   }
  // }

  async drop(): Promise<any> {
    await this.userRepository.delete({});

    Logger.log('[USER] Data has dropped.', 'SEEDER');
  }
}

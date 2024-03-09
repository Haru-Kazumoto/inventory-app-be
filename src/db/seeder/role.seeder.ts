import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Roles } from 'src/modules/role/entities/roles.entity';
import { Repository } from 'typeorm';
import { TransactionalError } from 'typeorm-transactional';

@Injectable()
export class RoleSeeder implements Seeder {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async seed(): Promise<any> {
    await this.seedRole();
  }

  async seedRole(): Promise<any> {
    const roleData = [
      {
        name: 'ADMIN_TJKT',
        major: 'TJKT',
      },
      {
        name: 'ADMIN_TO',
        major: 'TO',
      },
      {
        name: 'ADMIN_TE',
        major: 'TE',
      },
      {
        name: 'ADMIN_AK',
        major: 'AK',
      },
      {
        name: 'SUPERADMIN',
        major: 'SUPERADMIN',
      },
    ];
    try {
      await Promise.all(
        roleData.map((roleDataParam) => {
          const newRole = this.roleRepository.create(roleDataParam);

          this.roleRepository.save(newRole);
        }),
      );

      Logger.log(
        `[ROLE] Seeder success with data : ${await this.roleRepository.count()}`,
        'SEEDER',
      );
    } catch (err) {
      if (err instanceof TransactionalError) {
        Logger.log('Seeding data failed.', 'SEEDER');
        throw new TransactionalError('Error seeding data.');
      }
    }
  }

  async drop(): Promise<any> {
    await this.roleRepository.delete({});

    Logger.log('[ROLE] Data has dropped.', 'SEEDER');
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Major } from 'src/enums/majors.enum';
import { Class } from 'src/modules/class/entitites/class.entity';
import { Repository } from 'typeorm';
import { TransactionalError } from 'typeorm-transactional';

@Injectable()
export class ClassSeeder implements Seeder {

    constructor(
        @InjectRepository(Class) private readonly classRepository: Repository<Class>
    ){}

    async seed(): Promise<any> {
        await this.seedClass();
    }

    async seedClass(): Promise<any>{
        const classData = [
            {
                class_name: 'LAB - 1',
                major: Major.TJKT
            },
            {
                class_name: 'LAB - 2',
                major: Major.TJKT
            },
            {
                class_name: 'LAB - 3',
                major: Major.TJKT
            },
            {
                class_name: 'LAB - KKPI',
                major: Major.TJKT
            },
            {
                class_name: 'LAB - COE',
                major: Major.TE
            },
            {
                class_name: 'LAB - AK 1',
                major: Major.AK
            },
            {
                class_name: 'LAB - AK 2',
                major: Major.AK
            },
            {
                class_name: 'LAB BENGKEL',
                major: Major.TO
            },
            {
                class_name: 'GUDANG',
                major: Major.TO
            }
        ];
        try{
            await Promise.all(
                classData.map(classDataParam => this.classRepository.save(
                    this.classRepository.create(classDataParam))
                )
            );

            Logger.log(`[CLASS] Seeder succcess with data : ${await this.classRepository.count()}`, "SEEDER")

        } catch(err) {
            if(err instanceof TransactionalError){
                Logger.log("Seeding data failed.", "SEEDER");
                throw new TransactionalError("Error seeding data.");
            }
        }
    }

    async drop(): Promise<any> {
        await this.classRepository.delete({});

        Logger.log("[CLASS] Data has dropped.", "SEEDER");
    }    
}

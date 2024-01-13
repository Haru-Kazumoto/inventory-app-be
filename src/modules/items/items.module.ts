import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemsRepository } from './repository/items.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item]),],
  controllers: [
    ItemsController
  ],
  providers: [
    ItemsService, 
    ItemsRepository
  ]
})
export class ItemsModule {}

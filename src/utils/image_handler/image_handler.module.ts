import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ImageController } from './image_handler.controller';
import { RequestItemsModule } from 'src/modules/request_items/request_items.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads/images'),
            serveRoot: '/uploads/images'
        }),
        RequestItemsModule
    ],
    controllers: [
        ImageController
    ]
})
export class ImageHandlerModule {}

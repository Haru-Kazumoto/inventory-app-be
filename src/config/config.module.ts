import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({
            session: true,
        }),
        ConfigModule.forRoot(
            {
              envFilePath: '.env',
              isGlobal: true
            }
        )
    ]
})
export class ConfigurationAppModule {}

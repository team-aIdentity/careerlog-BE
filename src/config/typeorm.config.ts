import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeORMConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('TYPEORM_DB_HOST'),
  port: configService.get<number>('TYPEORM_DB_PORT'),
  username: configService.get<string>('TYPEORM_DB_USERNAME'),
  password: configService.get<string>('TYPEORM_DB_PASSWORD'),
  database: configService.get<string>('TYPEORM_DB_NAME'),
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: true,
  autoLoadEntities: true,
});

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArticleController } from './article/article.controller';
import { ProductController } from './product/product.controller';
import { PaymentsService } from './payments/payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeORMConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { CareerModule } from './career/career.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeORMConfig(configService),
    }),
    AuthModule,
    UserModule,
    AdvertisementModule,
    CareerModule,
  ],
  controllers: [
    AppController,
    AuthController,
    ArticleController,
    ProductController,
  ],
  providers: [AppService, PaymentsService, AuthService, JwtService],
})
export class AppModule {}

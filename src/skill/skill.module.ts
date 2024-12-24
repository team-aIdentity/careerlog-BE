import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entity/skill.entity';
import { UserModule } from 'src/user/user.module';
import { JwtAccessAuthGuard } from 'src/auth/jwt/jwtAccessAuth.guard';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Skill]), UserModule],
  providers: [SkillService, JwtAccessAuthGuard, JwtService, UserService],
  controllers: [SkillController],
})
export class SkillModule {}

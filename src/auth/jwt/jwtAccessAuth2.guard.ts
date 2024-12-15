/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAccessAuthGuard2 implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      request.user = null;
      return true;
    }

    const accessToken = authorizationHeader.split(' ')[1];
    try {
      const user = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      await this.userService.updateLastActiveDate(user);
      request.user = user;
    } catch (err) {
      request.user = null;
    }

    return true;
  }
}

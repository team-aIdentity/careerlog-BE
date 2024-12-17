/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorizationHeader = request.headers['authorization'];

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'Authorization header is missing or invalid',
        );
      }

      const accessToken = authorizationHeader.split(' ')[1];

      const user = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      await this.userService.updateLastActiveDate(user);
      request.user = user;
      return user;
    } catch (err) {
      throw new UnauthorizedException(
        'Authorization header is missing or invalid',
      );
    }
  }
}

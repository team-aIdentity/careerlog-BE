/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const accessToken = request.cookies['accessToken'];
      if (!accessToken) {
        throw new UnauthorizedException('authorization should have value');
      }

      const user = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      request.user = user;
      return user;
    } catch (err) {
      return false;
    }
  }
}

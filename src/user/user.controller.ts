import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  async getMe(@GetUser('id') userId: string) {
    return {
      msg: 'user info',
      userId,
    };
  }
}

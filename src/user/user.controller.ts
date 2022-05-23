import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDTO } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@GetUser('id') userId: string) {
    return {
      msg: 'user info',
      userId,
    };
  }

  @Patch()
  async editUser(@GetUser('id') userId: number, @Body() dto: EditUserDTO) {
    return await this.userService.editUser(userId, dto);
  }
}

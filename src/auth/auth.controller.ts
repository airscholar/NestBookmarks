import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async login(@Body() dto: AuthDTO) {
    return this.authService.login(dto);
  }

  @Post('/signup')
  async signup(@Body() dto: AuthDTO) {
    return this.authService.signup(dto);
  }
}

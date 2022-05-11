import { Body, Controller, Post } from '@nestjs/common';
import { AuthDTO } from 'src/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login() {
    return this.authService.login();
  }

  @Post('/signup')
  async signup(@Body() dto: AuthDTO) {
    return this.authService.signup(dto);
  }
}

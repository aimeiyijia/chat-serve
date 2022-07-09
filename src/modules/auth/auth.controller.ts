import { Controller, Post, Request, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录测试
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() loginInfo ) {
    return this.authService.login(loginInfo);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/register')
  async register(@Request() req) {
    return this.authService.register(req.user);
  }
}

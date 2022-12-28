import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserCreateDTO } from './users/dto';
import { UserLoginDto } from './users/dto/userLogin.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/login')
  async login(@Body() data: UserLoginDto) {
    const user = await this.authService.validateUser(
      data.userEmail,
      data.userPassword,
    );
    if (!user) {
      throw new BadRequestException('Invalid email or pasword');
    }
    const token = await this.authService.login({ ...user });
    return {
      access_token: token,
      user: user,
    };
  }

  @Post('register')
  async register(@Body() data: UserCreateDTO) {
    return this.authService.register(data);
  }
}

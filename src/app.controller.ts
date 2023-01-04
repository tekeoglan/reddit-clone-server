import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
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

  @Post('login')
  async login(@Body() data: UserLoginDto, @Req() req: any) {
    const user = await this.authService.validateUser(
      data.userEmail,
      data.userPassword,
    );

    if (!user) {
      throw new BadRequestException('Invalid email or pasword');
    }

    req.session.user = user;
    const token = await this.authService.login({ ...user });
    return {
      access_token: token,
      user: user,
    };
  }

  @Post('register')
  async register(@Body() data: UserCreateDTO, @Req() req: any) {
    const user = this.authService.register(data);
    req.session.user = user;
    return user;
  }

  @Post('logout')
  async logout(@Req() req: any) {
    await req.session.destroy();
  }

  @Post('fetch-user')
  async getUser(@Req() req: any) {
    if (req.sessionID && req.session.user) {
      return { user: req.session.user };
    }
    throw new BadRequestException('session not found');
  }
}

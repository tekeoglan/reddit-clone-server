import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { SessionGuard } from './auth/session.guard';
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
    const user = await this.authService.login(data);

    if (!user) {
      throw new BadRequestException('Invalid email or pasword');
    }

    req.session.user = user;
    return user;
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
  @UseGuards(SessionGuard)
  async getUser(@Req() req: any) {
    return { user: req.session.user };
  }
}

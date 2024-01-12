import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { SessionGuard } from './auth/session.guard';
import { UserCreateDTO } from './users/dto';
import { UserLoginDto } from './users/dto/userLogin.dto';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

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
  async register(@Body() data: UserCreateDTO) {
    const user = this.authService.register(data);

    return user;
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: any) {
    res.clearCookie('connect.sid');

    await req.session.destroy();
  }

  @Post('fetch-user')
  @UseGuards(SessionGuard)
  async getUser(@Req() req: any) {
    return { user: req.session.user };
  }
}

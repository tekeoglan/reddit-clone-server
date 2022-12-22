import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInterface } from './users.interface';
import User from './users.entity';

@Controller('users')
@SerializeOptions({
  type: User,
  enableCircularCheck: true,
  enableImplicitConversion: true,
})
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.getUsers({});
  }

  @Post('user')
  async create(@Body() userData: UserInterface) {
    const { user_name, avatar_path } = userData;
    return this.usersService.createUser({
      user_name,
      avatar_path,
    });
  }

  @Get('user/:id/overview')
  async findOne(@Param('id') id: string) {
    const data = (await this.usersService.getUser({
      where: { user_id: Number(id) },
      select: {
        posts: {
          orderBy: {
            time_stamp: 'desc',
          },
        },
        comments: {
          include: {
            posts: true,
          },
          orderBy: {
            time_stamp: 'desc',
          },
        },
      },
    })) as {};
    return new User({ ...data }).getOverView();
  }

  @Patch('user/:id')
  async update(@Param('id') id: string, @Body() data: { avatar_path: string }) {
    const { avatar_path } = data;
    return this.usersService.updateUser({
      data: { avatar_path },
      where: { user_id: Number(id) },
    });
  }

  @Delete('user/:id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser({ user_id: Number(id) });
  }
}

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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInterface } from './users.interface';
import { users as UserModel } from '@prisma/client';
import { UserOverviewEntity } from './userOvierview.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserModel[]> {
    return this.usersService.getUsers({});
  }

  @Post('user')
  async create(@Body() userData: UserInterface): Promise<UserModel> {
    const { user_name, avatar_path } = userData;
    return this.usersService.createUser({
      user_name,
      avatar_path,
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id')
  async findOne(@Param('id') id: string) {
    const data = (await this.usersService.getUser({
      where: { user_id: Number(id) },
      select: {
        user_name: true,
        posts: {
          orderBy: {
            time_stamp: 'desc',
          },
        },
        comments: {
          orderBy: {
            time_stamp: 'desc',
          },
        },
      },
    })) as UserInterface;

    const entity = new UserOverviewEntity({
      userName: data?.user_name || 'user',
      posts: data?.posts || [],
      comments: data?.comments || [],
    });
    return entity.overView;
  }

  @Patch('user/:id')
  async update(
    @Param('id') id: string,
    @Body() data: { avatar_path: string },
  ): Promise<UserModel> {
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

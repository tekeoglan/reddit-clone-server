import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.interface';
import { users as UserModel } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  async create(@Body() userData: User): Promise<UserModel> {
    const { user_name, avatar_path } = userData;
    return this.usersService.createUser({
      user_name,
      avatar_path,
    });
  }

  @Get()
  async findAll(): Promise<UserModel[]> {
    return this.usersService.getUsers({});
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<UserModel | null> {
    return this.usersService.getUser({ user_id: Number(id) });
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

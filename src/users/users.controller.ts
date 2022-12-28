import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import User from './users.entity';
import { UserPatchDTO } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@SerializeOptions({
  type: User,
  enableCircularCheck: true,
  enableImplicitConversion: true,
})
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('user/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: UserPatchDTO) {
    return this.usersService.updateUser({
      data: { avatar_path: data.userAvatarPath, password: data.userPassword },
      where: { user_id: Number(id) },
    });
  }

  @Delete('user/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser({ user_id: Number(id) });
  }

  @Get('user/:id/overview')
  async getUserOverView(@Param('id') id: string) {
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
    return new User({ ...data }).overView;
  }

  @Get('user/:id/posts')
  async getUserPosts(@Param('id') id: string) {
    const data = (await this.usersService.getUser({
      where: { user_id: Number(id) },
      select: {
        posts: {
          orderBy: {
            time_stamp: 'desc',
          },
        },
      },
    })) as {};
    return new User({ ...data });
  }

  @Get('user/:id/comments')
  async getUserComments(@Param('id') id: string) {
    const data = (await this.usersService.getUser({
      where: { user_id: Number(id) },
      select: {
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
    return new User({ ...data });
  }
}

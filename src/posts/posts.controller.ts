import {
  Controller,
  Get,
  Post as Create,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import Post from './posts.entity';
import { SessionGuard } from '../auth/session.guard';
import { PostCreateDTO } from './dto';

@Controller('posts')
@SerializeOptions({
  type: Post,
  enableCircularCheck: true,
  enableImplicitConversion: true,
})
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return this.postsService.getPosts({
      orderBy: {
        time_stamp: 'desc',
      },
    });
  }

  @Get('page')
  async findPage(@Query('cursor') cursor: string) {
    const pageProps = Number(cursor)
      ? { skip: 1, cursor: { post_id: Number(cursor) } }
      : {};

    const firstItem = (await this.postsService.getPosts({ take: 1 })) as Post[];

    const data = (await this.postsService.getPosts({
      take: 5,
      ...pageProps,
      include: {
        users: {
          select: {
            user_name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        time_stamp: 'desc',
      },
    })) as Post[];

    if (data.length === 0) return { data: null, next_cursor: null };

    if (data[data.length - 1].post_id === firstItem[0].post_id)
      return { data: data, next_cursor: null };

    return { data: data, next_cursor: data[data.length - 1].post_id };
  }

  @Create('post')
  @UseGuards(SessionGuard)
  async create(@Body() data: PostCreateDTO) {
    return this.postsService.createPost({
      title: data.title,
      text: data.text,
      img_path: data.imagePath,
      yt_path: data.ytPath,
      users: {
        connect: {
          user_id: data.userId,
        },
      },
    });
  }

  @Get('post/:id')
  async findOne(@Param('id') id: string) {
    return this.postsService.getPost({
      where: { post_id: Number(id) },
      include: {
        users: { select: { user_name: true } },
        comments: {
          include: {
            users: {
              select: {
                user_name: true,
              },
            },
          },
          orderBy: { time_stamp: 'desc' },
        },
      },
    });
  }

  @Create('post/:id/upvote')
  @UseGuards(SessionGuard)
  async upVote(@Param('id') id: string) {
    return this.postsService.update({
      where: { post_id: Number(id) },
      data: { upvotes_count: { increment: 1 } },
    });
  }

  @Create('post/:id/downvote')
  @UseGuards(SessionGuard)
  async downVote(@Param('id') id: string) {
    return this.postsService.update({
      where: { post_id: Number(id) },
      data: { upvotes_count: { decrement: 1 } },
    });
  }
}

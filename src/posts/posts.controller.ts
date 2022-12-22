import {
  Controller,
  Get,
  Post as Create,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostInterface } from './posts.interface';
import Post from './posts.entity';

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

  @Create('post')
  async create(@Body() postData: PostInterface) {
    return this.postsService.createPost(postData);
  }

  @Get('post/:id')
  async findOne(@Param('id') id: string) {
    return this.postsService.getPost({
      where: { post_id: Number(id) },
      include: { comments: { orderBy: { time_stamp: 'desc' } } },
    });
  }
}

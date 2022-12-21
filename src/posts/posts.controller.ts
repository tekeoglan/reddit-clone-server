import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostInterface } from './posts.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return this.postsService.getPosts({});
  }

  @Post('post')
  async create(@Body() postData: PostInterface) {
    return this.postsService.createPost(postData);
  }

  @Get('post/:id')
  async findOne(@Param('id') id: string) {
    return this.postsService.getPost({ post_id: Number(id) });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { posts as PostModel, posts, Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPost(
    postsWhereUniqueInput: Prisma.postsWhereUniqueInput,
  ): Promise<PostModel | null> {
    return this.prisma.posts.findUnique({
      where: postsWhereUniqueInput,
    });
  }

  async getPosts(params: Prisma.postsFindManyArgs): Promise<PostModel[]> {
    return this.prisma.posts.findMany({
      ...params,
    });
  }

  async createPost(data: Prisma.postsCreateInput): Promise<PostModel> {
    return this.prisma.posts.create({ data });
  }

  async deletePost(
    where: Prisma.postsWhereUniqueInput,
  ): Promise<PostModel | null> {
    return this.prisma.posts.delete({ where });
  }
}

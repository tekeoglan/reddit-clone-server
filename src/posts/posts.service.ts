import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { posts as PostModel, Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(params: Prisma.postsFindManyArgs): Promise<unknown> {
    return this.prisma.posts.findMany({
      ...params,
    });
  }

  async getPost(args: Prisma.postsFindFirstArgs): Promise<unknown> {
    return this.prisma.posts.findFirst({
      ...args,
    });
  }

  async createPost(data: Prisma.postsCreateInput): Promise<PostModel> {
    return this.prisma.posts.create({ data });
  }

  async update(params: {
    where: Prisma.postsWhereUniqueInput;
    data: Prisma.postsUpdateInput;
  }): Promise<PostModel> {
    const { where, data } = params;

    return this.prisma.posts.update({
      where,
      data,
    });
  }

  async deletePost(
    where: Prisma.postsWhereUniqueInput,
  ): Promise<PostModel | null> {
    return this.prisma.posts.delete({ where });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { comments as CommentModel, Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(params: Prisma.commentsFindManyArgs): Promise<CommentModel[]> {
    return this.prismaService.comments.findMany({ ...params });
  }

  async create(data: Prisma.commentsCreateInput): Promise<CommentModel> {
    return this.prismaService.comments.create({ data });
  }

  async update(params: {
    where: Prisma.commentsWhereUniqueInput;
    data: Prisma.commentsUpdateInput;
  }): Promise<CommentModel> {
    const { where, data } = params;

    return this.prismaService.comments.update({
      where,
      data,
    });
  }

  async remove(where: Prisma.commentsWhereUniqueInput): Promise<CommentModel> {
    return this.prismaService.comments.delete({ where });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { comments as CommentModel, Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.commentsCreateInput): Promise<CommentModel> {
    return this.prismaService.comments.create({ data });
  }

  findAll(params: Prisma.commentsFindManyArgs): Promise<CommentModel[]> {
    return this.prismaService.comments.findMany({ ...params });
  }

  remove(where: Prisma.commentsWhereUniqueInput): Promise<CommentModel> {
    return this.prismaService.comments.delete({ where });
  }
}

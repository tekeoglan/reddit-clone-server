import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { SessionGuard } from 'src/auth/session.guard';
import { CommentCreateDTO } from './dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findAll() {
    return this.commentsService.findAll({ orderBy: { time_stamp: 'desc' } });
  }

  @Post('comment')
  @UseGuards(SessionGuard)
  async create(@Body() data: CommentCreateDTO) {
    return this.commentsService.create({
      users: { connect: { user_id: data.userId } },
      posts: { connect: { post_id: data.postId } },
      text: data.text,
    });
  }

  @Delete('comment/:id')
  @UseGuards(SessionGuard)
  async remove(@Param('id') id: string) {
    return this.commentsService.remove({ comment_id: Number(id) });
  }

  @Post('comment/:id/upvote')
  @UseGuards(SessionGuard)
  async upVote(@Param('id') id: string) {
    return this.commentsService.update({
      where: { comment_id: Number(id) },
      data: { upvotes_count: { increment: 1 } },
    });
  }

  @Post('comment/:id/downvote')
  @UseGuards(SessionGuard)
  async downVote(@Param('id') id: string) {
    return this.commentsService.update({
      where: { comment_id: Number(id) },
      data: { upvotes_count: { decrement: 1 } },
    });
  }
}

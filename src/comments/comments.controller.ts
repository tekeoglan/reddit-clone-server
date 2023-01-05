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
import { CommentInterface } from './comments.interface';
import { SessionGuard } from 'src/auth/session.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll({ orderBy: { time_stamp: 'desc' } });
  }

  @Post('comment')
  @UseGuards(SessionGuard)
  create(@Body() data: CommentInterface) {
    return this.commentsService.create(data);
  }

  @Delete('comment/:id')
  @UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.commentsService.remove({ comment_id: Number(id) });
  }
}

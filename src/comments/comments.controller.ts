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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll({ orderBy: { time_stamp: 'desc' } });
  }

  @Post('comment')
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CommentInterface) {
    return this.commentsService.create(data);
  }

  @Delete('comment/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.commentsService.remove({ comment_id: Number(id) });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentInterface } from './comments.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('comment')
  create(@Body() data: CommentInterface) {
    return this.commentsService.create(data);
  }

  @Get()
  findAll(@Query() query: any) {
    //return this.commentsService.findAll({});
    return `${query}`;
  }

  @Delete('comment/:id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove({ comment_id: Number(id) });
  }
}

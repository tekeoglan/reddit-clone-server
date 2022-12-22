import { Exclude, Type } from 'class-transformer';
import Post from '../posts/posts.entity';

class Comment {
  @Exclude()
  comment_id: number;
  @Exclude()
  post_id: number;
  @Exclude()
  user_id: number;
  time_stamp: string;
  text: string;
  upvotes_count: number;
  @Type(() => Post)
  posts: Post;

  constructor(partial: Partial<Comment>) {
    Object.assign(this, partial);
  }
}

export default Comment;

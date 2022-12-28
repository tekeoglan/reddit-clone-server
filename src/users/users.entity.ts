import { Exclude, Type } from 'class-transformer';
import Post from '../posts/posts.entity';
import Comment from '../comments/comments.entity';

class User {
  user_id: number;
  user_name: string;
  avatar_path: string;
  email: string;
  @Exclude()
  password: string;
  @Type(() => Post)
  posts: Post[];

  @Type(() => Comment)
  comments: Comment[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  get overView(): Array<Post | Comment> {
    // @ts-ignore
    const result = this.posts?.concat(this.comments || {});
    result?.sort((a, b) => Date.parse(a.time_stamp) - Date.parse(b.time_stamp));
    return result || [{}];
  }
}

export default User;

import { CommentInterface } from 'src/comments/comments.interface';
import { PostInterface } from 'src/posts/posts.interface';

export class UserOverviewEntity {
  userName: string;

  posts: PostInterface[];

  comments: CommentInterface[];

  get overView(): Array<PostInterface | CommentInterface> {
    // @ts-ignore
    return this.posts.concat(this.comments);
  }

  constructor(partial: Partial<UserOverviewEntity>) {
    Object.assign(this, partial);
  }
}

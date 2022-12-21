import { CommentInterface } from 'src/comments/comments.interface';
import { PostInterface } from 'src/posts/posts.interface';

export interface UserInterface {
  user_name: string;
  avatar_path: string;
  posts?: PostInterface[];
  comments?: CommentInterface[];
}

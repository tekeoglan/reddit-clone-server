import { Exclude } from 'class-transformer';

class Post {
  post_id: number;
  title: string;
  text: string;
  img_path: string;
  yt_path: string;
  upvotes_count: number;
  @Exclude()
  user_id: number;
  time_stamp: string;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}

export default Post;

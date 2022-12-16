export interface Post {
  title: string;
  text?: string;
  img_path?: string;
  yt_path?: string;
  upvotes_count?: number;
  time_stamp: Date | string;
  users: { connect: { user_id: number } };
}

export interface PostInterface {
  title: string;
  text?: string;
  img_path?: string;
  yt_path?: string;
  upvotes_count?: number;
  users: { connect: { user_id: number } };
}

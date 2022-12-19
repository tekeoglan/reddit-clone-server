export interface CommentInterface {
  time_stamp: Date | string;
  text: string;
  upvotes_count?: number;
  posts: { connect: { post_id: number } };
  users: { connect: { user_id: number } };
}

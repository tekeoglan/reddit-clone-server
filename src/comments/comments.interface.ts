export interface CommentInterface {
  text: string;
  upvotes_count?: number;
  posts: { connect: { post_id: number } };
  users: { connect: { user_id: number } };
}

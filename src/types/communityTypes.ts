import { Tables } from "./supabase";

export type Comment = Tables<"comments">;
export type User = Tables<"users">;
export type CommentWithUser = Comment & {
  user: Pick<User, "avatar" | "nickname" | "id">;
};
export type Post = Tables<"posts">;
export type BookmarkData = Tables<"bookmark">;
export type PostWithUser = Post & {
  user: Pick<User, "avatar" | "nickname" | "id">;
} & {
  comment_count: number;
  bookmark_count: number;
};

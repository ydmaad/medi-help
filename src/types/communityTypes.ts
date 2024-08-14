import { Tables } from "./supabase";

export type Comment = Tables<"comments">;
export type User = Tables<"users">;
export type CommentWithUser = Comment & {
  user: Pick<User, "avatar" | "nickname" | "id">;
};
export type Post = Tables<"posts">;
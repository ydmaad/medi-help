import { useThrottle } from "@/hooks/useThrottle";
import { fetchComment, postComment } from "@/lib/commentsAPI";
import { Tables } from "@/types/supabase";
import Image from "next/image";
import React from "react";

interface CommentInputProps {
  newComment: string;
  setNewComment: (comment: string) => void;
  comment: string;
  setComment: () => void;
  postId: string;
}

type Comment = Tables<"comments">;
type User = Tables<"users">;
type CommentWithUser = Comment & {
  user: Pick<User, "avatar" | "nickname" | "id">;
};

export const CommentInput = ({
  newComment,
  setNewComment,
  comment,
  setComment,
  postId,
}: CommentInputProps) => {
  // 댓글 달기 핸들러
  const handleAddComment = useThrottle(async () => {
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }
    try {
      await postComment(postId, newComment);
      setNewComment("");
      const updateComments = await fetchComment(postId);
      setComment(updateComments.data);
      alert("댓글이 추가되었습니다.");
    } catch (error) {
      console.error("댓글 추가 실패 :", (error as Error).message);
      alert("댓글 추가에 실패했습니다. 다시 시도해 주세요.");
    }
  }, 2000);
  return (
    <>
      <div className="max-w-[1000px] mx-4 p-4 bg-white  border border-gray-300  rounded-lg">
        <div className="flex items-center mb-3">
          <Image
            src={user?.avatar || "/default-avatar.jpg"}
            alt={"유저 이미지"}
            width={40}
            height={40}
            className="rounded-full mr-3 aspect-square object-cover"
          />
          <h2 className="text-l mt-[15px] mb-4">{user?.nickname}</h2>
        </div>

        <textarea
          className="w-full text-xs px-2  focus:outline-none  resize-none"
          placeholder={`댓글을 입력해주세요.\n게시글과 무관한 악성 댓글은 삭제될 수 있습니다.`}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>

        <div className="flex justify-end">
          <button
            onClick={handleAddComment}
            className="w-[90px] bg-brand-primary-500 text-white px-4 py-2 rounded-lg hover:bg-brand-primary-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            작성
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentInput;

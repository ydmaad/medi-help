import { useThrottle } from "@/hooks/useThrottle";
import { useToast } from "@/hooks/useToast";
import { fetchComment, postComment } from "@/lib/commentsAPI";
import { useAuthStore } from "@/store/auth";
import { CommentWithUser } from "@/types/communityTypes";

import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

interface CommentInputProps {
  newComment: string;
  setNewComment: (comment: string) => void;
  comment: CommentWithUser[];
  setComment: Dispatch<SetStateAction<CommentWithUser[]>>;
  postId: string;
}

export const CommentInput = ({
  newComment,
  setNewComment,
  comment,
  setComment,
  postId,
}: CommentInputProps) => {
  const { user } = useAuthStore();
  const { toast } = useToast();

  // 댓글 달기 핸들러
  const handleAddComment = useThrottle(async () => {
    if (!newComment.trim()) {
      toast.warning("댓글을 입력해주세요.");
      return;
    }
    try {
      await postComment(postId, newComment);
      setNewComment("");
      const updateComments = await fetchComment(postId);
      setComment(updateComments.data);
      toast.success("댓글이 추가되었습니다.");
    } catch (error) {
      console.error("댓글 추가 실패 :", (error as Error).message);
      toast.error("댓글 추가에 실패했습니다. 다시 시도해 주세요.");
    }
  }, 2000);

  // console.log(comment);

  return (
    <>
      <div className="max-w-[996px] h-[162px] p-[15px] flex flex-col bg-white  border border-gray-300  rounded-lg">
        <div className="flex items-center mb-0 desktop:mb-3">
          <Image
            src={user?.avatar || "/defaultAvatar.svg"}
            alt={"유저 이미지"}
            width={24}
            height={24}
            className="rounded-full mr-3 aspect-square object-cover"
          />
          <h2 className="text-[14px] desktop:text-[16px] ">{user?.nickname}</h2>
        </div>

        <textarea
          className="w-full text-[14px] px-2 mt-[15px] desktop:mt-[10px] focus:outline-none  resize-none flex-grow"
          placeholder={`댓글을 입력해주세요.\n게시글과 무관한 악성 댓글은 삭제될 수 있습니다.`}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>

        <div className="flex justify-end">
          <button
            onClick={handleAddComment}
            className={`w-[72px] desktop:w-[90px] h-[32px] desktop:h-[40px] text-[14px] desktop:text-[16px]px-4 rounded-lg  focus:outline-none focus:ring-2 focus:ring-brand-primary-600 ${newComment.length > 0 ? "bg-brand-primary-500 text-white hover:bg-brand-primary-600" : "bg-brand-gray-200 text-brand-gray-600"}`}
          >
            등록
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentInput;

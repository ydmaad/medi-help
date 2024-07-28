"use client";

import { Tables } from "@/types/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CommentsProps {
  postId: string;
}

type Comment = Tables<"comments">;

type User = Tables<"users">;

type CommentWithUser = Comment & { user: Pick<User, "avatar" | "nickname"> };

const fetchComment = async (postId: string) => {
  const response = await fetch(`/api/community/${postId}/comments`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error("댓글을 불러오는데 실패했습니다.");
  }
  return data;
};

const deleteComment = async (postId: string, commentId: string) => {
  const response = await fetch(`/api/community/${postId}/comments`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });

  if (!response.ok) {
    throw new Error("댓글 삭제에 실패했습니다.");
  }
};

const editComment = async (
  comment: string,
  postId: string,
  commentId: string
) => {
  const response = await fetch(`/api/community/${postId}/comments`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
  const data = response.json();
  if (!response.ok) {
    throw new Error("댓글 수정에 실패했습니다.");
  }
  return data;
};

const postComment = async (postId: string, comment: string) => {
  const response = await fetch(`/api/community/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post_id: postId, comment }),
  });

  if (!response.ok) {
    throw new Error(`오류 : ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  // console.log(data);
  return data;
};

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comment, setComment] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const getComment = async () => {
      try {
        const getData = await fetchComment(postId);
        setComment(getData.data);
      } catch (error) {
        console.log((error as Error).message);
      }
    };
    getComment();
  }, [postId]);

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      alert("댓글을 삭제하였습니다.");
      // 댓글 목록 새로고침
      const updateComments = await fetchComment(postId);
      setComment(updateComments.data);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const handleAddComment = async () => {
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
  };

  // console.log(comment);

  return (
    <>
      {/* 여기에 현재 로그인 된 유저의 아바타와 닉네임이 보이도록 할 예정!! */}
      <div className="max-w-2xl  p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">댓글</h2>

        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`댓글을 입력해주세요.\n게시글과 무관한 악성 댓글은 삭제될 수 있습니다.`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          댓글 달기
        </button>
      </div>

      {comment?.map((ment) => {
        return (
          <div
            key={ment.id}
            className="my-2 p-4 bg-slate-200 rounded-lg shadow-md w-[500px]"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <Image
                    src={ment.user?.avatar || "/default-avatar.jpg"}
                    alt={"유저 이미지"}
                    width={40}
                    height={40}
                    className="rounded-full mr-3 aspect-square object-cover"
                  />
                  <div className="font-semibold">{ment.user.nickname}</div>
                </div>

                <div className="mt-1">{ment.comment}</div>
                <div className="text-gray-500">
                  {new Date(ment.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  수정
                </button>
                <button
                  onClick={() => handleDelete(ment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Comments;

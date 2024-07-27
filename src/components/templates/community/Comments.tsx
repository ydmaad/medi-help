"use client";

import { Tables } from "@/types/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CommentsProps {
  id: string;
}

type Comment = Tables<"comments">;

type User = Tables<"users">;

type CommentWithUser = Comment & { user: Pick<User, "avatar" | "nickname"> };

const fetchComment = async (id: string) => {
  const response = await fetch(`/api/community/${id}/comments`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error("댓글을 불러오는데 실패했습니다.");
  }
  return data;
};

const Comments: React.FC<CommentsProps> = ({ id }) => {
  const [comment, setComment] = useState<CommentWithUser[]>([]);

  useEffect(() => {
    const getComment = async () => {
      try {
        const getData = await fetchComment(id);
        setComment(getData.data);
      } catch (error) {
        console.log((error as Error).message);
      }
    };
    getComment();
  }, [id]);

  // console.log(comment);

  return (
    <>
      {comment?.map((ment) => {
        return (
          <div
            key={ment.id}
            className="my-2 p-4 bg-slate-200 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <Image
                    src={ment.user?.avatar || "/default-avatar.png"}
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
                <button className="text-red-500 hover:text-red-700">
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

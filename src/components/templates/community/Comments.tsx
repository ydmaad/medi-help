"use client";

import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CommentsProps {
  postId: string;
}

type Comment = Tables<"comments">;
type User = Tables<"users">;
type CommentWithUser = Comment & {
  user: Pick<User, "avatar" | "nickname" | "id">;
};

// 댓글 가져오기 요청
const fetchComment = async (postId: string) => {
  const response = await fetch(`/api/community/${postId}/comments`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error("댓글을 불러오는데 실패했습니다.");
  }
  // 날짜를 기준으로 내림차순 정렬
  data.data.sort(
    (a: CommentWithUser, b: CommentWithUser) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return data;
};

// 댓글 삭제 요청
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

// 댓글 수정 요청
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
    body: JSON.stringify({ id: commentId, comment }),
  });
  const data = response.json();
  if (!response.ok) {
    throw new Error("댓글 수정에 실패했습니다.");
  }
  return data;
};

// 댓글 등록 요청
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
  const [isEdit, setIsEdit] = useState<{ [key: string]: boolean }>({});
  const [editedComment, setEditedComment] = useState<{ [key: string]: string }>(
    {}
  );
  const { user } = useAuthStore();

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

  // 사용자 권한 확인 함수
  const modifyUser = (commentUserId: string) => {
    return user && user.id === commentUserId;
  };

  // 댓글 삭제 핸들러
  const handleDelete = async (commentId: string, commentUserId: string) => {
    if (!modifyUser(commentUserId)) {
      alert("작성자만 댓글을 삭제할 수 있습니다.");
      return;
    }
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

  // 댓글 달기 핸들러
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

  // 수정 모드 전환 핸들러
  const handleEdit = (
    commentId: string,
    currentComment: string,
    commentUserId: string
  ) => {
    if (!modifyUser(commentUserId)) {
      alert("작성자만 댓글을 수정할 수 있습니다.");
      return;
    }
    setIsEdit((prev) => ({ ...prev, [commentId]: true }));
    setEditedComment((prev) => ({ ...prev, [commentId]: currentComment }));
  };

  // 수정 취소 핸들러
  const handleCancelEdit = (commentId: string) => {
    setIsEdit((prev) => ({ ...prev, [commentId]: false }));
    setEditedComment((prev) => ({ ...prev, [commentId]: "" }));
  };

  // 수정 완료 핸들러
  const handleSaveEdit = async (commentId: string) => {
    try {
      await editComment(editedComment[commentId], postId, commentId);
      const updatedComments = await fetchComment(postId);
      setComment(updatedComments.data);
      setIsEdit((prev) => ({ ...prev, [commentId]: false }));
      setEditedComment((prev) => ({ ...prev, [commentId]: "" }));
      alert("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("댓글 수정 실패:", (error as Error).message);
      alert("댓글 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // console.log(comment);

  return (
    <>
      {/* TODO : 여기에 현재 로그인 된 유저의 아바타와 닉네임이 보이도록 할 예정!! */}
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
                {/* 수정모드 삼항연산자 */}
                {isEdit[ment.id] ? (
                  // 수정모드일때 (true)
                  <div>
                    <textarea
                      value={editedComment[ment.id] || ment.comment}
                      onChange={(e) =>
                        setEditedComment((prev) => ({
                          ...prev,
                          [ment.id]: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(ment.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => handleCancelEdit(ment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 일반 모드일 떼(false) - 원래 댓글 내용 표시
                  <div className="mt-1">{ment.comment}</div>
                )}
                <div className="text-gray-500">
                  {new Date(ment.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEdit[ment.id] && (
                  <>
                    <button
                      onClick={() =>
                        handleEdit(ment.id, ment.comment, ment.user.id)
                      }
                      className="text-blue-500 hover:text-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(ment.id, ment.user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Comments;

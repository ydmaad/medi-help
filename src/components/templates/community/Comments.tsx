"use client";

import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface CommentsProps {
  postId: string;
}

type Comment = Tables<"comments">;
type User = Tables<"users">;
type CommentWithUser = Comment & {
  user: Pick<User, "avatar" | "nickname" | "id">;
};

// 학습 필요!!
type FunctionType<Args extends unknown[], Return> = (...args: Args) => Return;

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
  const user = useAuthStore.getState().user;
  if (!user) {
    throw new Error("사용자 인증 정보가 없습니다.");
  }

  try {
    const response = await fetch(`/api/community/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Id": user.id,
      },
      body: JSON.stringify({ post_id: postId, comment }),
    });

    if (!response.ok) {
      throw new Error(`오류 : ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("댓글 등록 오류 =>", error);
    alert("댓글 등록 실패");
  }
};

// 댓글 따닥 방지 훅(useThrottle이라는 커스텀 훅) - 실행할 함수(callback)와 쓰로틀링간격(delay)를 인수로 받음
function useThrottle<Args extends unknown[], Return>(
  callback: FunctionType<Args, Return>,
  delay: number // 밀리초 단위의 시간 간격
): FunctionType<Args, Return> {
  // 마지막으로 함수가 실행된 시간을 저장
  const lastRun = useRef(Date.now());
  // 메모이제이션된 콜백을 반환 - 불필요한 렌더링 방지
  return useCallback(
    // 나중에 이 함수가 호출될 때 전달될 모든 인자를 받아들임
    (...args: Args): Return => {
      // 현재 시간을 가져옴
      const now = Date.now();
      // 현재 시간과 마지막 실행된 시간을 뺐을 때 delay(2초)보다 크거나 같다면
      if (now - lastRun.current >= delay) {
        // 마지막 실행시간을 현재시간으로 업데이트
        lastRun.current = now;
        // 원본 콜백함수를 실행하고 그 결과를 반환
        return callback(...args);
      }
      // 타입 안전성을 위해 실제 반환값의 타입을 사용
      // 이 부분은 실행되지 않지만, TypeScript의 타입 체크를 통과하기 위해 필요
      return undefined as unknown as Return;
    },
    // callback이나 delay가 변경될 때만 새로운 함수를 생성
    [callback, delay]
  );
}

const Comments = ({ postId }: CommentsProps) => {
  const [comment, setComment] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isEdit, setIsEdit] = useState<{ [key: string]: boolean }>({});
  const [editedComment, setEditedComment] = useState<{ [key: string]: string }>(
    {}
  );
  const { user } = useAuthStore();

  // 댓글 불러오는 중
  useEffect(() => {
    const getComment = async () => {
      try {
        const getData = await fetchComment(postId);
        setComment(getData.data);
        // console.log(getData.data);
      } catch (error) {
        console.log((error as Error).message);
      }
    };
    getComment();
  }, [postId]);
  // console.log(comment.user.id);

  // 사용자 권한 확인 함수
  const modifyUser = (commentUserId: string) => {
    // console.log(user?.id);
    // console.log(commentUserId);
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

  // 내용 표시 - 단락 구분
  const formatContent = (content: string) => {
    return content.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
      </p>
    ));
  };

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

      {comment?.map((ment) => {
        return (
          <div
            key={ment.id}
            className={`my-4 p-4 mx-4 border border-gray-300 rounded-lg  max-w-[1000px] relative ${
              user?.id === ment.user.id && "bg-brand-gray-50"
            } ${
              isEdit && user?.id === ment.user.id
                ? "bg-white"
                : "bg-brand-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex  justify-center items-center">
                    <Image
                      src={ment.user?.avatar || "/default-avatar.jpg"}
                      alt={"유저 이미지"}
                      width={40}
                      height={40}
                      className="rounded-full mr-3 aspect-square object-cover"
                    />
                    <div className="text-[16px] mt-[15px] mb-4">
                      {ment.user.nickname}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center space-x-2">
                    {isEdit[ment.id] ? (
                      <button
                        onClick={() => handleCancelEdit(ment.id)}
                        className="text-sm text-gray-500  absolute top-6 right-6"
                      >
                        취소
                      </button>
                    ) : (
                      <button className="hidden">취소</button>
                    )}
                  </div>
                </div>
                {/* 수정모드 삼항연산자 */}
                {isEdit[ment.id] ? (
                  // 수정모드일때 (true)
                  <>
                    <textarea
                      value={editedComment[ment.id] || ment.comment}
                      onChange={(e) =>
                        setEditedComment((prev) => ({
                          ...prev,
                          [ment.id]: e.target.value,
                        }))
                      }
                      className="w-[700px] h-[50px] px-2 focus:outline-none resize-none"
                    />
                    <div className="absolute bottom-2 right-4">
                      <button
                        onClick={() => handleSaveEdit(ment.id)}
                        className="w-[90px] mb-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        수정
                      </button>
                    </div>
                  </>
                ) : (
                  // 일반 모드일 떼(false) - 원래 댓글 내용 표시
                  <>
                    <div className="mt-1 w-full">
                      {formatContent(ment.comment)}
                    </div>
                    <div className="text-gray-500 mt-3 text-sm">
                      {new Date(ment.created_at).toLocaleString()}
                    </div>
                  </>
                )}
              </div>
              <div className="flex space-x-2">
                {!isEdit[ment.id] && (
                  <>
                    {user?.id === ment.user.id && (
                      <>
                        <button
                          onClick={() =>
                            handleEdit(ment.id, ment.comment, ment.user.id)
                          }
                          className="text-sm text-gray-500 pr-2 hidden desktop:flex"
                        >
                          수정
                        </button>
                        <button
                          onClick={() =>
                            handleEdit(ment.id, ment.comment, ment.user.id)
                          }
                          className="text-sm text-gray-500 pr-2 flex desktop:hidden"
                        >
                          <Image
                            src="/commentUpBtn.svg"
                            alt="댓글수정버튼"
                            width={20}
                            height={20}
                          ></Image>
                        </button>

                        <div className="mx-4 h-4.5 w-px bg-gray-300 hidden desktop:flex "></div>
                        <button
                          onClick={() => handleDelete(ment.id, ment.user.id)}
                          className="text-sm text-gray-500 pl-2 hidden desktop:flex"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => handleDelete(ment.id, ment.user.id)}
                          className="text-sm text-gray-500 pl-2 flex desktop:hidden"
                        >
                          <Image
                            src="/commentDelBtn.svg"
                            alt="댓글삭제버튼"
                            width={20}
                            height={20}
                          ></Image>
                        </button>
                      </>
                    )}
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

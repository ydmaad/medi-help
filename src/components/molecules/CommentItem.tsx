import { deleteComment, editComment, fetchComment } from "@/lib/commentsAPI";
import { useAuthStore } from "@/store/auth";
import { CommentWithUser } from "@/types/communityTypes";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

interface CommentItemProps {
  comment: CommentWithUser[];
  setComment: Dispatch<SetStateAction<CommentWithUser[]>>;
  isEdit: { [key: string]: boolean };
  setIsEdit: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  editedComment: { [key: string]: string };
  setEditedComment: Dispatch<SetStateAction<{ [key: string]: string }>>;
  postId: string;
}

const CommentItem = ({
  comment,
  setComment,
  isEdit,
  setIsEdit,
  editedComment,
  setEditedComment,
  postId,
}: CommentItemProps) => {
  const { user } = useAuthStore();

  // 사용자 권한 확인 함수
  const modifyUser = (commentUserId: string) => {
    // console.log(user?.id);
    // console.log(commentUserId);
    return user && user.id === commentUserId;
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
      <div>
        {comment?.map((ment) => {
          return (
            <div
              key={ment.id}
              className={`my-4 p-4 mx-4 border border-gray-300 rounded-lg  max-w-[1000px] relative  ${
                isEdit && user?.id === ment.user.id
                  ? "bg-brand-gray-50"
                  : "bg-white"
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
      </div>
    </>
  );
};

export default CommentItem;

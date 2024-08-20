import { useToast } from "@/hooks/useToast";
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
  const { toast } = useToast();

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
      toast.success("댓글이 수정되었습니다.");
    } catch (error) {
      console.error("댓글 수정 실패:", (error as Error).message);
      toast.error("댓글 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 댓글 삭제 핸들러
  const handleDelete = async (commentId: string, commentUserId: string) => {
    if (!modifyUser(commentUserId)) {
      toast.error("작성자만 댓글을 삭제할 수 있습니다.");
      return;
    }
    try {
      await deleteComment(postId, commentId);
      toast.success("댓글을 삭제하였습니다.");
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
      toast.warning("작성자만 댓글을 수정할 수 있습니다.");
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
              className={`my-4 p-4  border border-gray-300 rounded-lg  max-w-[996px] relative  ${
                isEdit && user?.id === ment.user.id
                  ? "bg-brand-gray-50"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-between">
                <div className="flex justify-between mb-2 flex-col w-full">
                  {/* 아바타 + 닉네임 + 수정,삭제 버튼 */}
                  <div className="flex justify-between ">
                    <div className="flex items-center">
                      <Image
                        src={ment.user?.avatar || "/defaultAvatar.svg"}
                        alt={"유저 이미지"}
                        width={40}
                        height={40}
                        className="rounded-full mr-3 aspect-square object-cover"
                      />
                      <div className="text-[16px] mt-[15px] mb-4">
                        {ment.user.nickname}
                      </div>
                    </div>
                    <div>
                      <div className="flex">
                        {!isEdit[ment.id] && (
                          <>
                            {user?.id === ment.user.id && (
                              <>
                                {/* 데스트탑 수정, 삭제 버튼 */}
                                <div className="hidden desktop:flex">
                                  <button
                                    onClick={() =>
                                      handleEdit(
                                        ment.id,
                                        ment.comment,
                                        ment.user.id
                                      )
                                    }
                                    className="text-sm text-gray-500 pr-2 "
                                  >
                                    수정
                                  </button>
                                  <div className="mx-[8px] h-4.5 w-px bg-gray-300"></div>
                                  <button
                                    onClick={() =>
                                      handleDelete(ment.id, ment.user.id)
                                    }
                                    className="text-sm text-gray-500 pl-2"
                                  >
                                    삭제
                                  </button>
                                </div>
                                {/* 모바일 수정,삭제 버튼 */}
                                <div className="flex desktop:hidden">
                                  <button
                                    onClick={() =>
                                      handleEdit(
                                        ment.id,
                                        ment.comment,
                                        ment.user.id
                                      )
                                    }
                                    className="text-sm text-gray-500 pr-2"
                                  >
                                    <Image
                                      src="/commentUpBtn.svg"
                                      alt="댓글수정버튼"
                                      width={20}
                                      height={20}
                                    ></Image>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(ment.id, ment.user.id)
                                    }
                                    className="text-sm text-gray-500 pl-2"
                                  >
                                    <Image
                                      src="/commentDelBtn.svg"
                                      alt="댓글삭제버튼"
                                      width={20}
                                      height={20}
                                    ></Image>
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* 아바타 + 닉네임 + 수정,삭제 버튼 */}

                  {/* 수정모드 삼항연산자 */}
                  {/* 댓글 내용 */}
                  <div>
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
                          className="w-full h-[50px] text-[14px] px-2 focus:outline-none resize-none bg-brand-gray-50"
                        />
                        <div className="absolute bottom-2 right-4">
                          <button
                            onClick={() => handleSaveEdit(ment.id)}
                            className="w-[90px] mb-2 bg-brand-primary-500 text-white px-4 py-2 rounded-lg hover:bg-brand-primary-600 focus:outline-none focus:ring-2 focus:ring-brand-primary-600"
                          >
                            수정
                          </button>
                        </div>
                      </>
                    ) : (
                      // 일반 모드일 떼(false) - 원래 댓글 내용 표시
                      <>
                        <div className="mt-1 w-full text-[14px]">
                          {formatContent(ment.comment)}
                        </div>
                        <div className="text-gray-500 mt-3 text-sm">
                          {new Date(ment.created_at).toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                  {/* 댓글 내용 */}

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
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CommentItem;

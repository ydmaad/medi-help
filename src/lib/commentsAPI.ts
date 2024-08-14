import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";

type Comment = Tables<"comments">;
type User = Tables<"users">;
type CommentWithUser = Comment & {
  user: Pick<User, "avatar" | "nickname" | "id">;
};

// 댓글 가져오기 요청
export const fetchComment = async (postId: string) => {
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
export const deleteComment = async (postId: string, commentId: string) => {
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
export const editComment = async (
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
export const postComment = async (postId: string, comment: string) => {
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

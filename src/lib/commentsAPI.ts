import { useAuthStore } from "@/store/auth";
import { CommentWithUser } from "@/types/communityTypes";

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

// 게시글 id를 받아 게시글 데이터 요청
// 따로 분리해서 재사용할 수 있는 부분(PostDetail, Edit)
export const fetchDetailPost = async (id: string) => {
  try {
    const response = await fetch(`/api/community/${id}`);
    if (!response.ok) {
      throw new Error("게시글 불러오는데 실패했습니다");
    }
    const { data } = await response.json();
    console.log("수정하려고 불러온 데이터 :", data);
    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 게시글 수정 요청
export const editPost = async (id: string, formData: FormData) => {
  const response = await fetch(`/api/community/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("게시글 수정에 실패했습니다.");
  }
  return await response.json();
};

// 게시글 등록 요청
export const fetchPost = async ({
  title,
  contents,
  image,
  category,
}: {
  title: string;
  contents: string;
  image: File[];
  category: string;
}) => {
  const user = useAuthStore.getState().user;

  if (!user) {
    throw new Error("사용자 인증 정보가 없습니다.");
  }

  try {
    // formData로 전송할 데이터 변경
    const formData = new FormData();
    formData.append("title", title);
    formData.append("contents", contents);
    formData.append("category", category);
    image.forEach((img) => {
      formData.append("image", img);
    });
    3;

    const response = await fetch(`/api/community/`, {
      method: "POST",
      headers: { "User-id": user.id },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    alert("게시글이 등록되었습니다!");
    window.location.href = "/community";
    return data;
  } catch (error) {
    console.error("게시글 등록 오류 =>", error);
    alert("게시글 등록 실패");
  }
};
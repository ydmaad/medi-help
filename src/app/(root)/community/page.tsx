"use client";

import List from "@/components/templates/community/List";
import Search from "@/components/templates/community/Search";
import { useAuthStore } from "@/store/auth";
import { Tables } from "@/types/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = Tables<"posts">;
type User = Tables<"users">;

type PostWithUser = Post & { user: Pick<User, "avatar" | "nickname"> };

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // console.log("검색어가 업데이트 돼는 부분!?!?", term);
  };

  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
  const handleUserCheck = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
    } else {
      router.push("/community/post");
    }
  };

  return (
    <>
      <div className="p-5">CommunityPage</div>
      <Link
        href={`/community/post`}
        onClick={handleUserCheck}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
      >
        게시글 쓰기
      </Link>
      <Search handleSearch={handleSearch} />
      <List searchTerm={searchTerm} posts={posts} setPosts={setPosts} />
    </>
  );
};
export default CommunityPage;

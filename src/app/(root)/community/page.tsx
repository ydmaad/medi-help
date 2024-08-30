"use client";

import PostFloatingBtn from "@/components/molecules/PostFloatingBtn";
import List from "@/components/templates/community/List";
import Search from "@/components/templates/community/Search";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/auth";
import { useCommunitySearchFlagStore } from "@/store/communitySearchFlag";
import { PostWithUser } from "@/types/communityTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [allPosts, setAllPosts] = useState<PostWithUser[]>([]);
  const { user } = useAuthStore();
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useCommunitySearchFlagStore();
  const { toast } = useToast();

  useEffect(() => {
    const fectchAllPosts = async () => {
      const res = await fetch(`/api/community`);
      const data = await res.json();
      setAllPosts(data);
    };

    fectchAllPosts();
  }, []);

  // 게시글 리스트 리셋
  const handleReset = () => {
    setSearchTerm("");
    allPosts;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // console.log("검색어가 업데이트 돼는 부분!?!?", term);
  };

  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
  const handleUserCheck = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!user) {
      toast.warning("로그인이 필요합니다.");
      router.push("/auth/login");
    } else {
      router.push("/community/post");
    }
  };

  // console.log(searchTerm);

  return (
    <>
      <div className="max-w-[996px] mx-auto mt-[90px] desktop:mt-[160px]">
        <div className="flex items-center justify-between mb-[28px] desktop:mb-[60px]">
          {/* 데스크탑 버전 */}
          <div className="hidden desktop:flex flex-col">
            <button
              onClick={handleReset}
              className="flex items-center text-[32px] font-bold"
            >
              <span className="mr-3">&#128172;</span>
              커뮤니티
            </button>
            <span className="text-brand-gray-600 text-[20px] font-extrabold mt-2">
              약에 대한 이야기를 나누어 보아요
            </span>
          </div>
          {/* 모바일 버전에서 검색토글 열렸을때 */}
          {isSearchOpen ? null : (
            <div className="flex desktop:hidden flex-col">
              <button
                onClick={handleReset}
                className="flex items-center text-[20px] font-bold"
              >
                <span className="mr-3">&#128172;</span>
                커뮤니티
              </button>
              <span className="text-brand-gray-600 text-[18px] font-extrabold mt-2">
                약에 대한 이야기를 나누어 보아요
              </span>
            </div>
          )}

          {/* 모바일 버전 */}

          <div
            className={`flex flex-row desktop:mx-0 ${isSearchOpen ? "mx-auto" : "mx-0"} `}
          >
            <div>
              <Search handleSearch={handleSearch} allPosts={allPosts} />
            </div>
            {/* 데스트탑 버전 */}
            <div>
              <Link
                href={`/community/post`}
                onClick={handleUserCheck}
                className="hidden desktop:flex items-center justify-center ml-[24px] w-[106px] h-[40px] bg-brand-primary-500 text-white px-[24px] py-2 rounded-md shadow-sm hover:bg-brand-primary-600"
              >
                <span className="text-center">글쓰기</span>
              </Link>

              {/* 플로팅 버튼 */}
              <PostFloatingBtn onUserCheck={handleUserCheck}></PostFloatingBtn>
            </div>
          </div>
        </div>
        <List
          key={searchTerm}
          searchTerm={searchTerm}
          posts={posts}
          setPosts={setPosts}
        />
      </div>
    </>
  );
};
export default CommunityPage;

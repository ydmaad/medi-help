"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface Post {
  id: string;
  title: string;
  contents: string;
  created_at: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const postsPerPage = isMobile ? 4 : 3;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (user) {
          const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", user.id);

          if (error) {
            console.error("Error fetching posts:", error);
          } else {
            setPosts(data);
          }
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full flex justify-center desktop:block">
      <div className="w-[335px] desktop:w-[996px]">
        <h2 className="text-[16px] desktop:text-2xl font-bold mb-6 text-gray-1000">
          내가 쓴 글
        </h2>
        <div className="flex flex-col gap-6 items-center">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#f5f6f7] rounded-xl p-4 w-full h-[119px] desktop:h-auto desktop:py-5"
            >
              <h3 className="text-[14px] desktop:text-base font-bold mb-2 desktop:mb-[9px] text-brand-gray-1000">
                {post.title}
              </h3>
              <p className="text-[12px] desktop:text-xs text-brand-gray-600 mb-2 desktop:mb-[9px] line-clamp-2">
                {post.contents}
              </p>
              <p className="text-[12px] desktop:text-xs text-brand-gray-400">
                {formatDate(post.created_at)}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center mt-4 space-x-1">
          <button
            onClick={handlePrevPage}
            className={`px-4 py-2 ${
              currentPage === 1
                ? "text-brand-gray-400 cursor-not-allowed"
                : "text-brand-gray-700"
            }`}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from(
            { length: Math.ceil(posts.length / postsPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 ${
                  currentPage === index + 1
                    ? "text-brand-primary-600"
                    : "text-brand-gray-700"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
          <button
            onClick={handleNextPage}
            className={`px-4 py-2 ${
              indexOfLastPost >= posts.length
                ? "text-brand-gray-400 cursor-not-allowed"
                : "text-brand-gray-700"
            }`}
            disabled={indexOfLastPost >= posts.length}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
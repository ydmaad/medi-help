"use client";

import List from "@/components/templates/community/List";
import Search from "@/components/templates/community/Search";
import { Tables } from "@/types/supabase";
import { useState } from "react";

type Post = Tables<"posts">;

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // console.log("검색어가 업데이트 돼는 부분!?!?", term);
  };

  return (
    <>
      <div>CommunityPage</div>
      <Search handleSearch={handleSearch} />
      <List searchTerm={searchTerm} posts={posts} setPosts={setPosts} />
    </>
  );
};
export default CommunityPage;

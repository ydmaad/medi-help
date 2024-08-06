"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "@/utils/supabase/client";

interface Post {
  id: string;
  title: string;
  contents: string;
  created_at: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

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

  return (
    <div className="flex justify-center p-4">
    <div className="w-full max-w-4xl">
      <h2 className="text-xl mb-4">작성한 게시글</h2>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-100 p-4 rounded shadow-md overflow-hidden"
              style={{ maxHeight: "150px" }}
            >
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-700 overflow-hidden overflow-ellipsis" style={{ whiteSpace: "nowrap" }}>
                {post.contents}
              </p>
              <p className="text-gray-500 text-sm mt-2">{formatDate(post.created_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
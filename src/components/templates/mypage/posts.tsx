"use client";

import React, { useState, useEffect } from "react";
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
    <div className="w-full max-w-custom mx-auto px-4 py-2"> {/* Apply custom max-width */}
      <div className="pt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-1000">내가 쓴 글</h2> {/* Increased font size and weight */}
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-50 rounded-xl p-4 max-w-full" // Ensures the post container is full width
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-1000">{post.title}</h3>
              <p className="text-gray-600 mb-2">{post.contents}</p>
              <p className="text-gray-500 text-sm">{formatDate(post.created_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;

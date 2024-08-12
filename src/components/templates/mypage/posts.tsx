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
    <div className="w-full">
      <div className="w-full mx-auto pt-16"> {/* Added pt-16 for more top padding */}
        <h2 className="text-xl mb-6 text-gray-1000">내가 쓴 글</h2> {/* Changed color */}
        <div className="flex flex-col gap-6"> 
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-50 rounded-xl p-4"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-1000">{post.title}</h3> {/* Changed color */}
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

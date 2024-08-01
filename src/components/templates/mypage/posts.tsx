"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface Post {
  id: string;
  title: string;
  contents: string;
  user_id: string;
  created_at: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Auth session missing or error!", sessionError);
        return;
      }

      const userId = session.user.id;

      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, contents, user_id, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        setPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
    <div className="p-4">
      <h2 className="text-xl mb-4">내가 쓴 게시글</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-gray-100 p-4 rounded shadow mb-4">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-700">{post.contents}</p>
            <p className="text-gray-500 text-sm">{formatDate(post.created_at)}</p>
          </div>
        ))
      ) : (
        <p>게시글이 없습니다.</p>
      )}
    </div>
  );
}

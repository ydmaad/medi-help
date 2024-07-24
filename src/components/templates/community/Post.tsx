"use client";

import { useState } from "react";

const fetchPost = async ({
  title,
  contents,
}: {
  title: string;
  contents: string;
}) => {
  const reponse = await fetch(`/api/community/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: title, contents: contents }),
  });
  const data = await reponse.json();
  return data;
};

const Post = () => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  return (
    <>
      <div>글쓰기 하는데야!!!</div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        width={500}
        height={500}
      />
    </>
  );
};

export default Post;

import React from "react";

const PostDetail = async ({ id }: { id: string }) => {
  const reponse = await fetch(`http://localhost:3000/community/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await reponse.json();
  console.log(data);

  return <div>PostDetail</div>;
};

export default PostDetail;

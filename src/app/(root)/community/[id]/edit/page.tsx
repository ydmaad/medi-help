"use client";

import Edit from "@/components/templates/community/Edit";
import { useParams } from "next/navigation";
import React from "react";

const EditPage = () => {
  const params = useParams();
  const postId = params.id as string;
  return (
    <>
      <Edit id={postId} />
    </>
  );
};

export default EditPage;

"use client";

import Edit from "@/components/templates/community/Edit";
import { useParams } from "next/navigation";
import React from "react";

const EditPage = () => {
  const params = useParams();
  const postId = params.id as string;
  return (
    <>
      <div className="mt-[80px] desktop:mt-[150px] mx-auto max-w-[335px] desktop:max-w-[996px]">
        <Edit id={postId} />
      </div>
    </>
  );
};

export default EditPage;

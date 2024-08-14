"use client";

import CommentInput from "@/components/molecules/CommentInput";
import CommentItem from "@/components/molecules/CommentItem";
import {fetchComment} from "@/lib/commentsAPI";
import { CommentWithUser } from "@/types/communityTypes";
import { useEffect, useState } from "react";

interface CommentsProps {
  postId: string;
}

const Comments = ({ postId }: CommentsProps) => {
  const [comment, setComment] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isEdit, setIsEdit] = useState<{ [key: string]: boolean }>({});
  const [editedComment, setEditedComment] = useState<{ [key: string]: string }>(
    {}
  );

  // 댓글 불러오는 중
  useEffect(() => {
    const getComment = async () => {
      try {
        const getData = await fetchComment(postId);
        setComment(getData.data);
        // console.log(getData.data);
      } catch (error) {
        console.log((error as Error).message);
      }
    };
    getComment();
  }, [postId]);
  // console.log(comment.user.id);

  return (
    <>
      <CommentInput
        newComment={newComment}
        setNewComment={setNewComment}
        comment={comment}
        setComment={setComment}
        postId={postId}
      ></CommentInput>
      <CommentItem 
        comment={comment} 
        setComment={setComment} 
        isEdit={isEdit} 
        setIsEdit={setIsEdit}
        editedComment={editedComment}
        setEditedComment={setEditedComment}
        postId={postId}
        ></CommentItem>
      
    </>
  );
};

export default Comments;

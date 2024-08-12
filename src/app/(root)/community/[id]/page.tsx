import PostDetail from "@/components/templates/community/PostDetail";

const PostDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="mt-40">
        <PostDetail id={params.id} />
      </div>
    </>
  );
};

export default PostDetailPage;

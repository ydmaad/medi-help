import PostDetail from "@/components/templates/community/PostDetail";

const PostDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="mt-[114px] desktop:mt-[160px]">
        <PostDetail id={params.id} />
      </div>
    </>
  );
};

export default PostDetailPage;

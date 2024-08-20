import PostDetail from "@/components/templates/community/PostDetail";
import Header from "@/components/molecules/TopHeader";

const PostDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="mt-[114px] desktop:mt-[160px]">
        <div className="desktop:hidden">
          <Header showBackHeader={true} />
        </div>
        <PostDetail id={params.id} />
      </div>
    </>
  );
};

export default PostDetailPage;

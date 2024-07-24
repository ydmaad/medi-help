import List from "@/components/templates/community/List";

const DetailPost = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div>
        <List id={params.id} />
      </div>
    </>
  );
};

export default DetailPost;

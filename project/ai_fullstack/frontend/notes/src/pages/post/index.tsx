import React from "react";
import { useParams } from "react-router-dom";
// interface PostDetailProps {}
const PostDetail: React.FC = () => {
  const { id } = useParams();
  // console.log(params,'[[[[[[[[[[[[[[[[');
  console.log(id, "22222222222");

  return <>PostDetail</>;
};
export default PostDetail;

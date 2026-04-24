import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function NotFound() {
  // Link 点击跳转
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 6000);
  }, []);
  return <>没找到相关的路由</>;
}

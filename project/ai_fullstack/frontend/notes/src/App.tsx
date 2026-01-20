import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackToTop from "@/components/BackToTop";
export const needsLoginPath = ["/mine", "/order", "/chat", "/order"];
export default function App() {
  const { isLogin } = useUserStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLogin && needsLoginPath.includes(pathname)) {
      navigate("/login");
    }
  }, [isLogin, navigate, pathname]);

  
  return (
    <>
      <BackToTop></BackToTop>
    </>
  );
}

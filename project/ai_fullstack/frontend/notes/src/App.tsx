import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackToTop from "@/components/BackToTop";
import { NEEDS_LOGIN_PATHS } from "@/constants/auth";

export default function App() {
  const { isLogin } = useUserStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLogin && NEEDS_LOGIN_PATHS.some((path) => path === pathname)) {
      navigate("/login", { replace: true });
    }
  }, [isLogin, navigate, pathname]);

  return (
    <>
      <BackToTop></BackToTop>
    </>
  );
}

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "@/components/Loading";
import MainLayout from "@/layouts/MainLayout";
import { AliveScope } from "react-activation";

const Home = lazy(() => import("@/components/KeepAliveHome"));
const Mine = lazy(() => import("@/pages/Mine"));
const Login = lazy(() => import("@/pages/Login"));
const Order = lazy(() => import("@/pages/Order"));
const Chat = lazy(() => import("@/pages/Chat"));
const PostLayout = lazy(() => import("@/layouts/PostLayout"));
const PostDetail = lazy(() => import("@/pages/post"));
export default function RouterConfig({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Router>
      {/* 拥有了 keep live 能力 */}
      <AliveScope>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Post 模块 */}
            <Route path="/post" element={<PostLayout />}>
              <Route path=":id" element={<PostDetail />} />
              {/* <Route path="create"/> */}
            </Route>
            {/* 布局组件 */}
            <Route path="/" element={<MainLayout />}>
              <Route path="" element={<Home />} />
              <Route path="mine" element={<Mine />} />
              <Route path="order" element={<Order />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Routes>
        </Suspense>
      </AliveScope>
      {children}
    </Router>
  );
}

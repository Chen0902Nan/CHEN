import { useState, useContext, createContext } from "react";
import Page from "../views/Page";
// 跨层级通信数据状态的容器
// 直接export 可以多次
export const UserContext = createContext(null);
// 1次
export default function App() {
  const user = { name: "华高俊" };
  return (
    // context 提供给Page 组件树共享 数据容器
    // Provider 组件 数据提供者
    <UserContext.Provider value={user}>
      <Page></Page>
    </UserContext.Provider>
  );
}

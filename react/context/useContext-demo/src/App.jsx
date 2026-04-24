function Page({ user }) {
  return <Header user={user} />;
}

function Header({ user }) {
  return <UserInfo user={user} />;
}

function UserInfo({ user }) {
  return <div>{user.name}</div>;
}

export default function App() {
  const user = { name: "Andrew" }; // 数据  登录
  return <Page user={user}>1212212</Page>;
}

import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen safe-bottom-padding">
      <main className="mx-auto h-full w-full max-w-3xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

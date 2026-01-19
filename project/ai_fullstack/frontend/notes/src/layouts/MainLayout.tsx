import { Outlet } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
export default function MainLayout() {
  return (
    <div>
      <div className="min-h-screen bg-gray-500 pb-16">
        <div className="h-full w-full ">
          <Outlet></Outlet>
        </div>
        {/* 底栏 */}
        <BottomNav />
      </div>
    </div>
  );
}

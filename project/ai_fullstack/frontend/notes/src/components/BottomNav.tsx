import { Home, ListOrdered, User } from "lucide-react";
import type { ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { NEEDS_LOGIN_PATHS } from "@/constants/auth";

interface TabConfig {
  label: string;
  path: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const tabs: TabConfig[] = [
  {
    label: "首页",
    path: "/",
    icon: Home,
  },
  {
    label: "订单",
    path: "/order",
    icon: ListOrdered,
  },
  {
    label: "我的",
    path: "/mine",
    icon: User,
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLogin = useUserStore((state) => state.isLogin);

  const handleNav = (path: string) => {
    if (path === pathname) return;

    if (NEEDS_LOGIN_PATHS.some((needPath) => needPath === path) && !isLogin) {
      navigate("/login");
      return;
    }

    navigate(path);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4 safe-area-bottom">
      <div className="pointer-events-auto mx-auto flex h-16 w-full max-w-3xl items-center justify-around rounded-2xl border border-white/70 bg-white/90 px-2 shadow-[0_14px_30px_rgba(15,56,76,0.16)] backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => handleNav(tab.path)}
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl transition-all",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "transition-transform duration-300",
                  isActive && "-translate-y-0.5",
                )}
              />
              <span
                className={cn(
                  "text-[11px] tracking-wide",
                  isActive ? "font-semibold" : "font-medium",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

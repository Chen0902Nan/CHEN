import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  ImageUp,
  Sparkles,
  SquarePen,
  WandSparkles,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Loading from "@/components/Loading";

type AvatarAction = "camera" | "upload" | "ai";

export default function Mine() {
  const { user, logout, aiAvatar } = useUserStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const actions = useMemo(
    () => [
      {
        title: "我的订单",
        description: "查看支付记录与历史状态",
        icon: SquarePen,
        onClick: () => navigate("/order"),
      },
      {
        title: "AI Git 工具",
        description: "自动生成规范化提交信息",
        icon: WandSparkles,
        onClick: () => navigate("/git"),
      },
      {
        title: "RAG 问答实验室",
        description: "基于私有知识库检索并回答",
        icon: Sparkles,
        onClick: () => navigate("/rag"),
      },
    ],
    [navigate],
  );

  const handleAvatarAction = async (type: AvatarAction) => {
    setOpen(false);
    if (type !== "ai") return;

    setLoading(true);
    try {
      await aiAvatar();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 px-4 pt-4">
      <section className="glass-surface rounded-3xl p-5">
        <div className="flex items-center gap-4">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="relative overflow-hidden rounded-full border-2 border-white/70 shadow-[0_10px_20px_rgba(15,56,76,0.2)]"
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary/20 text-lg font-bold text-primary">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DrawerTrigger>

            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader className="text-left">
                  <DrawerTitle>更换头像</DrawerTitle>
                  <DrawerDescription>
                    选择更新方式，打造你的个人主页形象。
                  </DrawerDescription>
                </DrawerHeader>

                <div className="space-y-3 px-4 pb-2">
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start gap-2"
                    onClick={() => handleAvatarAction("camera")}
                  >
                    <Camera className="h-4 w-4 text-primary" />
                    拍照
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start gap-2"
                    onClick={() => handleAvatarAction("upload")}
                  >
                    <ImageUp className="h-4 w-4 text-primary" />
                    从相册上传
                  </Button>

                  <Button
                    className="h-12 w-full justify-start gap-2"
                    onClick={() => handleAvatarAction("ai")}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI 生成头像
                  </Button>
                </div>

                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="ghost" className="h-11 w-full">
                      取消
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
              Profile
            </p>
            <h2 className="mt-1 truncate text-2xl text-foreground">
              {user?.name ?? "未登录用户"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">ID: {user?.id ?? "-"}</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              type="button"
              onClick={action.onClick}
              className="fade-up flex w-full items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 text-left shadow-[0_8px_20px_rgba(15,56,76,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,56,76,0.14)]"
            >
              <div className="rounded-xl bg-secondary p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {action.title}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          );
        })}
      </section>

      <Button
        variant="destructive"
        className="mt-5 h-12 w-full rounded-2xl"
        onClick={() => logout()}
      >
        退出登录
      </Button>

      {loading && <Loading />}
    </div>
  );
}

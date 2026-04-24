import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Credentail } from "@/types";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Credentail>({
    name: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setError("");
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = formData.name.trim();
    const password = formData.password.trim();

    if (!name || !password) {
      setError("请先完整填写用户名和密码");
      return;
    }

    setLoading(true);
    try {
      await login({ name, password });
      navigate("/", { replace: true });
    } catch {
      setError("登录失败，请检查账号信息后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8">
      <div className="pointer-events-none absolute -left-16 top-4 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 right-2 h-48 w-48 rounded-full bg-accent/35 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/70 bg-white/88 p-6 shadow-[0_18px_36px_rgba(15,56,76,0.14)] backdrop-blur-md">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Notes Studio
          </p>
          <h1 className="text-3xl text-foreground">欢迎回来</h1>
          <p className="text-sm text-muted-foreground">登录后继续浏览你的收藏与创作</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">用户名</Label>
            <Input
              id="name"
              placeholder="请输入用户名"
              value={formData.name}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              placeholder="请输入密码"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="h-11 w-full gap-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                登录中...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                立即登录
              </>
            )}
          </Button>
        </form>

        <Button
          variant="ghost"
          className="mt-4 h-10 w-full gap-2"
          onClick={() => navigate("/")}
        >
          <ShieldCheck className="h-4 w-4" />
          暂不登录，先去首页
        </Button>
      </div>
    </div>
  );
}

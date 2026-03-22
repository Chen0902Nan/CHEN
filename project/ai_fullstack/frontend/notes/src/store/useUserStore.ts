// localstorage
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { doLogin, getAiAvatar } from "@/api/user";
import type { User } from "@/types/index";

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLogin: boolean;
  login: (credentials: { name: string; password: string }) => Promise<void>;
  aiAvatar: () => Promise<void>;
  logout: () => void;
}

// 高阶函数
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // state 对象
      accessToken: null,
      refreshToken: null,
      user: null,
      isLogin: false,
      login: async ({ name, password }) => {
        const { user, access_token, refresh_token } = await doLogin({
          name,
          password,
        });

        set({
          user,
          accessToken: access_token,
          refreshToken: refresh_token,
          isLogin: true,
        });
      },

      aiAvatar: async () => {
        const currentUser = get().user;
        if (!currentUser) return;

        const avatar = await getAiAvatar(currentUser.name);
        set({
          user: {
            ...currentUser,
            avatar,
          },
        });
      },

      logout: () => {
        set({
          user: null,
          isLogin: false,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isLogin: state.isLogin,
      }),
    },
  ),
);

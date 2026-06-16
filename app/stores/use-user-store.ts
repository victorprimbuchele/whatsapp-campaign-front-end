import { CURRENT_USER_ID } from "@/constants/auth";
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: {
    id: CURRENT_USER_ID,
    name: "User",
    email: "user@example.com",
  },
  setUser: (user) => set({ user }),
  getUser: () => get().user,
}));

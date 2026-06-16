import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

const USER_MOCK_UUID = "00000000-0000-0000-0000-000000000001";

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: {
    id: USER_MOCK_UUID,
    name: "User",
    email: "user@example.com",
  },
  setUser: (user) => set({ user }),
  getUser: () => get().user,
}));

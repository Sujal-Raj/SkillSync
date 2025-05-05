// userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  _id: string;
  name: string;
  // add other fields as needed
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage", // Key for localStorage
    }
  )
);

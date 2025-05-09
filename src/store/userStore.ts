// src/store/userStore.ts
import { create } from "zustand";

interface UserState {
  name: string;
  password: string;
  setUser: (name: string, password: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "",
  password: "",
  setUser: (name, password) => set({ name, password }),
}));

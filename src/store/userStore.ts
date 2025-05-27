// src/store/userStore.ts
import { create } from "zustand";

interface UserState {
  name: string;
  password: string;
  gender: string;
  department: string;
  hometown: string;
  hobbies: string[];
  languages: string[];
  photo: File | null;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  setUser: <K extends keyof Omit<UserState, 'setUser' | 'resetUser'>>(key: K, value: UserState[K]) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "",
  password: "",
  gender: "",
  department: "",
  hometown: "",
  hobbies: [],
  languages: [],
  photo: null,
  q1: 0,
  q2: 0,
  q3: 0,
  q4: 0,
  setUser: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetUser: () =>
    set({
      name: "",
      password: "",
      gender: "",
      department: "",
      hometown: "",
      hobbies: [],
      languages: [],
      photo: null,
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      setUser: () => {},
      resetUser: () => {},
    }),
}));

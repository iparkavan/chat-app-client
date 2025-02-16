import { UserInfoTypes } from "@/types/authentication-types";
import { create } from "zustand";

type AuthTypes = {
  // newUser: boolean;
  // setNewUser: (bool: boolean) => void;
  userInfo: UserInfoTypes | undefined;
  setUserInfo: (userInfo: UserInfoTypes) => void;
  // accessToken: string;
  // setAccessToken: (token: string) => void;
};

export const useAuthslice = create<AuthTypes>()((set) => ({
  // newUser: false,
  // setNewUser: (bool) => set({ newUser: bool }),
  userInfo: undefined,
  setUserInfo: (userInfo: UserInfoTypes) => set({ userInfo }),
  // accessToken: "",
  // setAccessToken: (accessToken: string) => set({ accessToken }),
}));

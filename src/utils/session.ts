import { IUser } from "~/types/user";

export const getUserData = (localStorage: Storage): IUser | null => {
  const localData = localStorage.getItem("userData");
  if (localData && localData !== "undefined") {
    return JSON.parse(localData) as IUser;
  }
  return null;
};

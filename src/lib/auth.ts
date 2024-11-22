import { readFromLocalStorage } from "./storageHelper";

export const getLoggedInUser = () => {
  const user = JSON.parse(readFromLocalStorage("user") || "{}");
  return user;
};

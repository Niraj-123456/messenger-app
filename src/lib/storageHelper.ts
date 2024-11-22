export const writeToLocalStorage = (key: string, value: any) => {
  if (typeof value === "object") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};

export const readFromLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const getRelativeTime = (timestamp: number) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now.getTime() - then.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} ${seconds > 1 ? "secs" : "sec"} ago`;
  if (minutes < 60) return `${minutes} ${minutes > 1 ? "mins" : "min"} ago`;
  if (hours < 24) return `${hours} ${hours > 1 ? "hrs" : "hr"} ago`;
  return `${days} ${days > 1 ? "days" : "day"} ago`;
};

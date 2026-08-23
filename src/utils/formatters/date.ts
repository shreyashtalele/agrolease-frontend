import { format, formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (
  date: string | Date,
  pattern: string = "MMM d, yyyy",
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, pattern);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM d, yyyy h:mm a");
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatDateRange = (start: string, end: string): string => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
};

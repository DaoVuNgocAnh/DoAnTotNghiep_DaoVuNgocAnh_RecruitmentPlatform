import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min?: number, max?: number, isNegotiable?: boolean): string {
  if (isNegotiable) return "Thỏa thuận";
  if (min && max) return `${min / 1000000} - ${max / 1000000} triệu`;
  if (min) return `Từ ${min / 1000000} triệu`;
  if (max) return `Lên đến ${max / 1000000} triệu`;
  return "Thỏa thuận";
}

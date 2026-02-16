import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToAscii(inputString: string) {
  // FIX: Return empty string if input is null or undefined
  if (!inputString) {
      return "";
  }

  // existing logic
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}
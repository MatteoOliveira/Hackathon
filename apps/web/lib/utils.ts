import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilitaire shadcn/ui : combine des classes Tailwind sans conflits
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

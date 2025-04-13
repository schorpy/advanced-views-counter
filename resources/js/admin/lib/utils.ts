import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text: string, message: string): void {
  if ("clipboard" in navigator) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(message);
      })
      .catch((error) => {
        toast.warning("Please copy your link manually.");
      });
  } else {
    // Fallback for browsers that don't support clipboard API
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success(message);
    } catch (err) {
      toast.warning("Please copy your link manually.");
    }
    document.body.removeChild(textArea);
  }
}
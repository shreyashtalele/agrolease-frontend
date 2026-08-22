import { useUIStore } from "@/store/uiStore";

export const useToast = () => {
  const { toasts, addToast, removeToast } = useUIStore();

  const showToast = (type: ToastType, message: string) => {
    addToast({ type, message });
  };

  return {
    toasts,
    success: (message: string) => showToast("success", message),
    error: (message: string) => showToast("error", message),
    info: (message: string) => showToast("info", message),
    warning: (message: string) => showToast("warning", message),
    removeToast,
  };
};

type ToastType = "success" | "error" | "info" | "warning";

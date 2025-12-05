import toast, { Toast } from "react-hot-toast";
import { ToastCard } from "@/components/ui/Toast/toast-card";

const options: Partial<Pick<Toast, "id" | "icon" | "duration" | "ariaProps" | "className" | "style" | "position" | "iconTheme" | "toasterId" | "removeDelay">> = {
  position: "top-right",
  duration: 10000
}

export const notify = {
  success(msg: string, desc?: string) {
    toast.custom((t) => (
      <ToastCard title={msg} message={desc} type="success" onClose={() => toast.dismiss(t.id)} autoClose={false} />
    ), options);
  },
  error(msg: string, desc?: string) {
    toast.custom((t) => (
      <ToastCard title={msg} message={desc} type="error" onClose={() => toast.dismiss(t.id)} autoClose={false} />
    ), options);
  },
  info(msg: string, desc?: string) {
    toast.custom((t) => (
      <ToastCard title={msg} message={desc} type="info" onClose={() => toast.dismiss(t.id)} autoClose={false} />
    ), options);
  },
};

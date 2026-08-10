import { useContext } from "react";
import { ToastContext } from "../contexts/toastContext/toast";

const useToast = () => {
  const context = useContext(ToastContext);
  if (context) {
    return context;
  }
};

export default useToast;

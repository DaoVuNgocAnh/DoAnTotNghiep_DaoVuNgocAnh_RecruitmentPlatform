import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export const useFlashMessage = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { message?: string; type?: string };
    if (state?.message) {
      const toastId = state.message;
      
      if (state.type === "error") toast.error(state.message, { id: toastId });
      else if (state.type === "warning") toast.warning(state.message, { id: toastId });
      else toast.info(state.message, { id: toastId });

      window.history.replaceState({}, document.title);
    }
  }, [location]);
};
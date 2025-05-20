import { useState } from "react";

const useToast = () => {
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ message: "", type: "", show: false }), duration);
  };

  return { toast, showToast };
};

export default useToast;
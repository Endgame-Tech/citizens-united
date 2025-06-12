import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white  toaster ${type === "success" ? "bg-[#2DB475]" : "bg-red-500"
        }`}
    >
      {message}
      <button onClick={onClose} className="ml-4">
        ✖
      </button>
    </div>
  );
};

export default Toast;

"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-800 bg-opacity-50 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white shadow-xl mx-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center p-6 border-gray-200 border-b">
            <h2 className="font-semibold text-gray-900 text-xl">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

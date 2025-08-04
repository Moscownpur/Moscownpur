import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-4xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform glass-card rounded-3xl soft-glow">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-heading gradient-text-cosmic">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-3 text-white/60 hover:text-white hover:glass-card rounded-xl smooth-transition"
            >
              <X size={24} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
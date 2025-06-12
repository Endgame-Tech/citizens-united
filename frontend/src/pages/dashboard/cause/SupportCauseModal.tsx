import React from 'react';
import { X } from 'lucide-react';
import SupportCauseForm from './SupportCauseForm';

interface SupportCauseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SupportCauseModal: React.FC<SupportCauseModalProps> = ({ open, onClose, onSuccess }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Support this Cause</h2>
        <SupportCauseForm onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default SupportCauseModal;

import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Trash2, X } from 'lucide-react';
import Toast from '../../../components/Toast';

type SupporterForm = { name: string; email: string; phone: string };
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOnes: SupporterForm[]) => void;
};


export default function AddSupportersModal({ isOpen, onClose, onSuccess }: Props) {
  const [rows, setRows] = useState<SupporterForm[]>([{ name: '', email: '', phone: '' }]);
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('Modal closed via ESC key');
        onClose();
      }
    };

    const firstInput = modalRef.current?.querySelector('input');
    if (firstInput) {
      firstInput.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRowChange = (index: number, field: keyof SupporterForm, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => setRows([...rows, { name: '', email: '', phone: '' }]);
  const removeRow = (index: number) => setRows(rows.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSuccess(rows);
      setToastInfo({ message: 'Invites sent', type: 'success' });
      onClose();
    } catch (err) {
      console.error('Add Supporters Error:', err);
      setToastInfo({ message: 'Failed to invite', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      console.log('Modal closed via overlay click');
      onClose();
    }
  };

  const handleClose = () => {
    console.log('Modal closed via close button');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 scale-100 sm:scale-105 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Supporters</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_40px] gap-4 items-center">
                <div>
                  <label htmlFor={`name-${idx}`} className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    id={`name-${idx}`}
                    value={row.name}
                    onChange={(e) => handleRowChange(idx, 'name', e.target.value)}
                    placeholder="Enter name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
                <div>
                  <label htmlFor={`email-${idx}`} className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    id={`email-${idx}`}
                    type="email"
                    value={row.email}
                    onChange={(e) => handleRowChange(idx, 'email', e.target.value)}
                    placeholder="Enter email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="text-red-500 hover:text-red-700 transition-colors mt-6"
                  aria-label={`Remove supporter ${idx + 1}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRow}
              className="flex items-center text-[#006837] hover:text-[#00592e] transition-colors text-sm font-medium"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add another supporter
            </button>
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${loading
                    ? 'bg-[#80a79a] cursor-not-allowed'
                    : 'bg-[#006837] hover:bg-[#00592e]'
                  }`}
              >
                {loading ? 'Sending...' : 'Send Invites'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {toastInfo && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo(null)}
        />
      )}
    </>
  );
}
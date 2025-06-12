import { useState } from 'react';
import { useParams } from 'react-router';
import { joinCause } from '../../../services/causeService';
import Toast from '../../../components/Toast';

export default function SupportCauseForm({ onSuccess }: { onSuccess?: () => void }) {
  const { code } = useParams<{ code: string }>();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showExtra, setShowExtra] = useState(false);
  const [extra, setExtra] = useState({
    citizenship: '' , // 'Nigerian Citizen' | 'Diasporan' | 'Foreigner'
    isVoter: '' ,     // 'Yes' | 'No'
    willVote: '' ,    // 'Yes' | 'No'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExtra({ ...extra, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowExtra(true);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await joinCause(code!, { ...form, ...extra });
      setToast({ message: 'You have supported this cause successfully!', type: 'success' });
      setForm({ firstName: '', lastName: '', email: '' });
      setExtra({ citizenship: '', isVoter: '', willVote: '' });
      setShowExtra(false);
      onSuccess?.();
    } catch {
      setToast({ message: 'Failed to support the cause. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Sign this cause</h3>
      {!showExtra ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-[#006837] text-white rounded hover:bg-[#00592e]"
          >
            {loading ? 'Submitting...' : 'Support'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleFinalSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block font-medium mb-1">Are you a Nigerian Citizen, Diasporan, or Foreigner?</label>
            <select
              name="citizenship"
              value={extra.citizenship}
              onChange={handleExtraChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Nigerian Citizen">Nigerian Citizen</option>
              <option value="Diasporan">Diasporan</option>
              <option value="Foreigner">Foreigner</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Are you a registered voter?</label>
            <select
              name="isVoter"
              value={extra.isVoter}
              onChange={handleExtraChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Will you vote in an election based on this cause?</label>
            <select
              name="willVote"
              value={extra.willVote}
              onChange={handleExtraChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-[#006837] text-white rounded hover:bg-[#00592e]"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

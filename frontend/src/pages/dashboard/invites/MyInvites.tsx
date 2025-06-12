import { useEffect, useState } from 'react';
import { getMyInvites, acceptInvite, declineInvite, Invite } from '../../../services/inviteService';
import Loading from '../../../components/Loader';
import Toast from '../../../components/Toast';
import { format } from 'date-fns';
import { Check, X, Info } from 'lucide-react';

interface EnhancedInvite extends Invite {
  isProcessing?: boolean;
}

export default function MyInvites() {
  const [invites, setInvites] = useState<EnhancedInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadInvites = async () => {
    setLoading(true);
    try {
      const data = await getMyInvites();
      setInvites(data.map((inv: Invite) => ({ ...inv, isProcessing: false })));
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load invites', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const handleAccept = async (token: string, inviteId: string) => {
    if (!confirm('Are you sure you want to accept this invitation?')) return;
    setInvites((prev) =>
      prev.map((inv) => (inv._id === inviteId ? { ...inv, isProcessing: true } : inv))
    );
    try {
      await acceptInvite(token);
      setToast({ message: 'Invitation accepted!', type: 'success' });
      loadInvites();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to accept invite', type: 'error' });
      setInvites((prev) =>
        prev.map((inv) => (inv._id === inviteId ? { ...inv, isProcessing: false } : inv))
      );
    }
  };

  const handleDecline = async (token: string, inviteId: string) => {
    if (!confirm('Are you sure you want to decline this invitation?')) return;
    setInvites((prev) =>
      prev.map((inv) => (inv._id === inviteId ? { ...inv, isProcessing: true } : inv))
    );
    try {
      await declineInvite(token);
      setToast({ message: 'Invitation declined!', type: 'success' });
      loadInvites();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to decline invite', type: 'error' });
      setInvites((prev) =>
        prev.map((inv) => (inv._id === inviteId ? { ...inv, isProcessing: false } : inv))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8 ">
      <h1 className="text-3xl font-normal text-[#006837] mb-6">My Invitations</h1>
      {invites.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-4 text-gray-600 text-lg">You have no pending invites.</p>
          <p className="mt-2 text-gray-500 text-sm">Check back later or explore causes to join!</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {invites.map((inv) => (
            <li
              key={inv._id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-[#006837]">{inv.cause.name}</p>
                    {inv.cause.description && (
                      <div className="group relative">
                        <Info
                          size={16}
                          className="text-gray-400 cursor-pointer hover:text-[#006837]"
                          aria-label="Cause description"
                        />
                        <div className="absolute hidden group-hover:block w-64 p-2 text-sm text-gray-700 bg-white border border-gray-200 rounded shadow-lg -top-2 left-6 z-10">
                          {inv.cause.description}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Invited on {format(new Date(inv.createdAt), 'PPP')}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(inv.token, inv._id)}
                    disabled={inv.isProcessing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm transition-transform duration-200 hover:scale-105 ${inv.isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#006837] hover:bg-[#004d2a]'
                      }`}
                    aria-label={`Accept invite to ${inv.cause.name}`}
                  >
                    <Check size={16} />
                    {inv.isProcessing ? 'Processing...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleDecline(inv.token, inv._id)}
                    disabled={inv.isProcessing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm transition-transform duration-200 hover:scale-105 ${inv.isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    aria-label={`Decline invite to ${inv.cause.name}`}
                  >
                    <X size={16} />
                    {inv.isProcessing ? 'Processing...' : 'Decline'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {toast && (
        <div className="fixed bottom-4 right-4 animate-slide-in">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
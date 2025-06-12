import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Loading from '../../../components/Loader';
import Toast from '../../../components/Toast';
import { acceptInvite } from '../../../services/inviteService';

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    (async () => {
      try {
        await acceptInvite(token!);
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    })();
  }, [token]);

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <div className="p-8 text-center text-red-600">Failed to accept invitation.</div>;

  return (
    <div className="p-8 text-center">
      <Toast message="Invitation accepted! Redirecting to dashboard..." type="success" onClose={() => { }} />
    </div>
  );
}
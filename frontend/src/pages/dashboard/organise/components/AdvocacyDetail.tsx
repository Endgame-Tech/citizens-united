// src/pages/advocacy/AdvocacyDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Edit2, ArrowLeft, Trash2, FileText } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../../../../context/UserContext';
import Loading from '../../../../components/Loader';
import Toast from '../../../../components/Toast';
import EditAdvocacyModal from './EditAdvocacyModal';

export default function AdvocacyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useUser();

  const fallbackImage = '/Advocacy.jpg';

  const [advocacy, setAdvocacy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchAdvocacy = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/advocacy/${id}`, { withCredentials: true });
      setAdvocacy(res.data);
    } catch (err) {
      setToast({ msg: 'Failed to load advocacy', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocacy();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/advocacy/${id}`, { withCredentials: true });
      navigate('/dashboard');
    } catch {
      setToast({ msg: 'Delete failed', type: 'error' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
  if (!advocacy) return <div className="min-h-screen flex items-center justify-center text-red-600">Advocacy not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 font-poppins">
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            navigate("/dashboard");
            sessionStorage.setItem("dashboardPage", "Advocacy Hub");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#006837] text-white rounded hover:bg-[#00592e]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {profile?.role === 'admin' && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#006837] text-white rounded hover:bg-[#00592e]">
              <Edit2 size={16} /> Edit
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className='flex flex-col'>
        {/* Display Image */}
        <img
          src={advocacy.displayImage && advocacy.displayImage.trim() !== '' ? advocacy.displayImage : fallbackImage}
          alt={advocacy.title}
          className="w-full h-64 object-cover rounded-t-2xl shadow"
        />

        {/* Content Container */}
        <div className="bg-white/90 relative z-10 p-6 backdrop-blur-sm rounded-b-2xl border-x border-b border-gray-300 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{advocacy.title}</h1>
            <p className="text-gray-700">{advocacy.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Goals</h2>
            {advocacy.goals?.length ? (
              <div className="flex flex-wrap gap-2">
                {advocacy.goals.map((goal: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-[#006837]/10 text-[#006837] rounded-full text-sm">
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No goals defined.</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Toolkits & Resources</h2>
            {advocacy.toolkits?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advocacy.toolkits.map((tk: any, i: number) => (
                  <a
                    key={i}
                    href={tk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 border border-green-600 bg-green-100 hover:bg-green-200 transition rounded-xl"
                  >
                    <FileText className="text-green-700" size={20} />
                    <div className="flex-1 text-green-900 font-medium truncate">{tk.label}</div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No toolkits added.</p>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modals */}
      <EditAdvocacyModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          setIsEditOpen(false);
          fetchAdvocacy();
        }}
        advocacy={advocacy}
      />


      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this advocacy?</h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

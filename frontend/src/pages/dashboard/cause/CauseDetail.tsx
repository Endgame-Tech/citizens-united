import React, { useEffect, useState, Component, Fragment, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import Loading from '../../../components/Loader';
import Toast from '../../../components/Toast';
import EditCauseModal from './EditCauseModal';
import AddSupportersModal from './AddSupportersModal';
import SupporterRow from './SupporterRow';
import { getCauseById, updateCause, deleteCause, uploadRichDescriptionImage } from '../../../services/causeService';
import { getSupporters, updateSupporter } from '../../../services/supporterService';
import { sendInvites } from '../../../services/inviteService';
import { Edit2, UserPlus, ArrowLeft, Mail, Upload } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import BroadcastModal from './broadcasts/BroadcastModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-600 font-poppins">Error rendering component</div>;
    }
    return this.props.children;
  }
}

export default function CauseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cause, setCause] = useState<any>(null);
  const [supporters, setSupporters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [richDescription, setRichDescription] = useState('');

  const quillRef = useRef<ReactQuill>(null);

  const handleImageUpload = async () => {
    console.log('handleImageUpload triggered');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/jpeg,image/png');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setToast({ msg: 'Image size exceeds 5MB', type: 'error' });
          return;
        }
        try {
          setLoading(true);
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
          });
          console.log('Original File Size:', file.size);
          console.log('Compressed File Size:', compressedFile.size);

          const imageUrl = await uploadRichDescriptionImage(compressedFile);

          if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', imageUrl);
            setToast({ msg: 'Image uploaded successfully', type: 'success' });
          }
        } catch (error) {
          console.error('Image upload error:', error);
          setToast({ msg: 'Failed to upload image', type: 'error' });
        } finally {
          setLoading(false);
        }
      }
    };
  };

  useEffect(() => {
    console.log('Quill Ref:', quillRef.current);
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      console.log('Quill Instance:', quill);
      if (quill) {
        const toolbar = quill.getModule('toolbar');
        console.log('Toolbar Module:', toolbar);
        toolbar.addHandler('image', handleImageUpload);
        console.log('Image handler attached');
      } else {
        console.error('Quill instance is undefined');
      }
    } else {
      console.error('Quill ref is not initialized');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCauseById(id!), getSupporters(id!)])
      .then(([col, sup]) => {
        setCause(col);
        setSupporters(sup);
      })
      .catch(() => setToast({ msg: 'Failed to load data', type: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setRichDescription(cause?.richDescription || '');
  }, [cause]);

  const onEdit = async (updates: any) => {
    try {
      const updated = await updateCause(id!, updates);
      setCause(updated);
      setToast({ msg: 'Cause updated', type: 'success' });
    } catch {
      setToast({ msg: 'Update failed', type: 'error' });
    }
  };

  const onAddSup = async (newOnes: { name: string; email: string }[]) => {
    try {
      await sendInvites(id!, newOnes.map(({ name, email }) => ({ name, email })));
      const sup = await getSupporters(id!);
      setSupporters(sup);
      setToast({ msg: 'Invites sent', type: 'success' });
    } catch (err) {
      console.error('Invite Error:', err);
      setToast({ msg: 'Failed to send invites', type: 'error' });
    }
  };

  const onSupUpdate = async (supId: string, updates: any) => {
    try {
      const updated = await updateSupporter(supId, updates);
      setSupporters(prev => prev.map(x => (x._id === supId ? updated : x)));
      setToast({ msg: 'Supporter updated', type: 'success' });
    } catch {
      setToast({ msg: 'Status update failed', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCause(id!);
      setToast({ msg: 'Cause deleted', type: 'success' });
      navigate('/dashboard');
    } catch {
      setToast({ msg: 'Failed to delete', type: 'error' });
      setDeleteOpen(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
    sessionStorage.setItem("dashboardPage", "Mobilise");

  };


  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loading /></div>;
  if (!cause) return <div className="flex items-center justify-center min-h-screen"><div className="p-8 text-red-600">Cause not found</div></div>;

  return (
    <section className='flex flex-col'>
      <div className="bg-white p-5 border-b flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-gray-600 hover:text-[#006837] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Mobilise
        </button>
        <span className="text-sm text-gray-400">Citizens United</span>

      </div>
      <div className="max-w-6xl mx-auto p-6 font-poppins">
        <ErrorBoundary>
          {/* Banner Image */}
          <div className="mb-8 relative group cursor-pointer">
            {cause.bannerImageUrl ? (
              <>
                <img
                  src={cause.bannerImageUrl}
                  alt={cause.name}
                  className="w-full h-64 object-cover rounded-xl border"
                />
                <div
                  className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl"
                  onClick={() => {
                    setEditOpen(true);
                    // This will set the active tab to 'media' when the edit modal opens
                    sessionStorage.setItem('activeEditTab', 'media');
                  }}
                >
                  <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-[#006837]" />
                    <span className="text-sm font-medium text-gray-800">Change Banner Image</span>
                  </div>
                </div>
              </>
            ) : (
              <div
                className="w-full h-64 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center"
                onClick={() => {
                  setEditOpen(true);
                  // This will set the active tab to 'media' when the edit modal opens
                  sessionStorage.setItem('activeEditTab', 'media');
                }}
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to add a banner image</p>
              </div>
            )}
          </div>

          {/* Cause Info */}
          <div className="bg-white rounded-2xl p-6 mb-8 ">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-800">{cause.name}</h1>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium
                      ${cause.approvalStatus === 'approved' && 'text-green-700 bg-green-100 border-green-300'}
                      ${cause.approvalStatus === 'pending' && 'text-yellow-700 bg-yellow-100 border-yellow-300'}
                      ${cause.approvalStatus === 'rejected' && 'text-red-700 bg-red-100 border-red-300'}
                      `}>
                    {cause.approvalStatus}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{cause.description}</p>
              </div>
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#006837] text-white rounded-lg hover:bg-[#00592e] transition"
              >
                <Edit2 className="w-5 h-5" /> Edit Cause
              </button>
            </div>
          </div>

          {/* Classification Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-gray-700">Classification</h2>
                <button
                  onClick={() => {
                    setEditOpen(true);
                  }}
                  className="text-sm text-[#006837] hover:text-[#00592e] transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Cause Type:</h3>
                  <p className="text-gray-800">{cause.causeType || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Scope:</h3>
                  <p className="text-gray-800">{cause.scope || "Not specified"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-gray-700">Location</h2>
                <button
                  onClick={() => {
                    setEditOpen(true);
                  }}
                  className="text-sm text-[#006837] hover:text-[#00592e] transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">State:</h3>
                  <p className="text-gray-800">{cause.location?.state || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">LGA:</h3>
                  <p className="text-gray-800">{cause.location?.lga || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Ward:</h3>
                  <p className="text-gray-800">{cause.location?.ward || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Goals and Targets Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-gray-700">Goals</h2>
                <button
                  onClick={() => {
                    setEditOpen(true);
                  }}
                  className="text-sm text-[#006837] hover:text-[#00592e] transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cause.goals?.length ? cause.goals.map((g: string, i: number) => <span key={i} className="px-3 py-1 bg-[#006837]/10 text-[#006837] rounded-full">{g}</span>) : <p className="text-gray-500">No goals defined.</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-gray-700">Target Candidates</h2>
                <button
                  onClick={() => {
                    setEditOpen(true);
                  }}
                  className="text-sm text-[#006837] hover:text-[#00592e] transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cause.targets?.length ? cause.targets.map((t: string, i: number) => <span key={i} className="px-3 py-1 bg-[#006837]/10 text-[#006837] rounded-full">{t}</span>) : <p className="text-gray-500">No targets defined.</p>}
              </div>
            </div>
          </div>

          {/* Partners Section */}
          <div className="bg-white rounded-2xl p-6 mb-8 border">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-gray-700">Partners</h2>
              <button
                onClick={() => {
                  setEditOpen(true);
                }}
                className="text-sm text-[#006837] hover:text-[#00592e] transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cause.partners?.length ? cause.partners.map((p: string, i: number) => <span key={i} className="px-3 py-1 bg-[#006837]/10 text-[#006837] rounded-full">{p}</span>) : <p className="text-gray-500">No partners defined.</p>}
            </div>
          </div>

          {/* Toolkits Section */}
          <div className="bg-white rounded-2xl p-6 mb-8 border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-700">Toolkits & Resources</h2>
              <button
                onClick={() => {
                  setEditOpen(true);
                }}
                className="text-sm text-[#006837] hover:text-[#00592e] transition-colors"
              >
                Edit
              </button>
            </div>
            {cause.toolkits?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {cause.toolkits.map((toolkit: any, i: number) => (
                  <div key={i} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{toolkit.label}</h3>
                        <a
                          href={toolkit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate block mb-2"
                        >
                          {toolkit.url}
                        </a>
                      </div>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        {toolkit.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No toolkits have been added yet.</p>
            )}
          </div>

          {/* Rich Description Editor */}
          <div className="bg-white rounded-2xl p-6 mb-8 border">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-gray-700">Rich Description</h2>
              <span className="text-xs text-gray-500">Use this editor to create content with formatting, lists, and embedded videos</span>
            </div>
            <ReactQuill
              ref={quillRef}
              value={richDescription}
              onChange={setRichDescription}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ 'header': 1 }, { 'header': 2 }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image', 'video'],
                  ['clean']
                ],
              }}
              formats={['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'header', 'list', 'bullet', 'link', 'image', 'video']}
              className="mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => onEdit({ richDescription })}
                className="px-5 py-2 bg-[#006837] text-white rounded-lg hover:bg-[#00592e] transition-colors"
              >
                Save Rich Description
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Supporters ({supporters.length})</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setAddOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#006837] text-white rounded-lg hover:bg-[#00592e] transition"
                >
                  <UserPlus className="w-5 h-5" /> Add Supporters
                </button>
                <button
                  onClick={() => setBroadcastOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Mail className="w-5 h-5" /> Send Message
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {supporters.map(s => (
                    <SupporterRow key={s._id} supporter={s} onUpdate={upd => onSupUpdate(s._id, upd)} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setDeleteOpen(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >Delete Cause</button>
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <EditCauseModal isOpen={editOpen} onClose={() => setEditOpen(false)} cause={cause} onSuccess={onEdit} />
        </ErrorBoundary>
        <ErrorBoundary>
          <AddSupportersModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSuccess={onAddSup} />
        </ErrorBoundary>
        <ErrorBoundary>
          <BroadcastModal
            isOpen={broadcastOpen}
            onClose={() => setBroadcastOpen(false)}
            causeId={id!}
            onSuccess={() => setToast({ msg: 'Broadcast sent successfully', type: 'success' })}
          />
        </ErrorBoundary>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <Transition appear show={deleteOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setDeleteOpen(false)}>
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-xl p-6 shadow">
                <Dialog.Title className="text-lg font-semibold">Confirm Delete</Dialog.Title>
                <p className="mt-4 text-gray-700">Are you sure? This action can’t be undone.</p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Cancel
                  </button>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </div>
    </section>
  );
}

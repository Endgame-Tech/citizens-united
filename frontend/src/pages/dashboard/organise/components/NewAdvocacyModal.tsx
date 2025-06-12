import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import Toast from '../../../../components/Toast';
import { createAdvocacy } from '../../../../services/advocacyService';
import compressImage from '../../../../utils/ImageCompression';
import getCroppedImg from '../../../../utils/getCroppedImg';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NewAdvocacyModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goals: [] as string[],
    toolkits: [] as { label: string; url: string; type: 'Toolkit' | 'Policy' }[],
    displayImage: '',
  });
  const [goalInput, setGoalInput] = useState('');
  const [toolkitInput, setToolkitInput] = useState({ label: '', url: '', type: 'Toolkit' as 'Toolkit' | 'Policy' });
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ','].includes(e.key) && goalInput.trim()) {
      e.preventDefault();
      setForm({ ...form, goals: [...form.goals, goalInput.trim()] });
      setGoalInput('');
    }
  };

  const removeGoal = (index: number) => {
    setForm({ ...form, goals: form.goals.filter((_, i) => i !== index) });
  };

  const addToolkit = () => {
    if (!toolkitInput.label || !toolkitInput.url) return;
    setForm({ ...form, toolkits: [...form.toolkits, toolkitInput] });
    setToolkitInput({ label: '', url: '', type: 'Toolkit' });
  };

  const removeToolkit = (index: number) => {
    setForm({ ...form, toolkits: form.toolkits.filter((_, i) => i !== index) });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { compressedFile, error } = await compressImage(file);
    if (error || !compressedFile) {
      setToastInfo({ message: 'Image compression failed', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(compressedFile);
    reader.onload = () => setFileSrc(reader.result as string);
  };

  const onCropComplete = (area: any, areaPixels: any) => {
    setCroppedArea(areaPixels);
  };

  const uploadCroppedImage = async () => {
    if (!fileSrc || !croppedArea) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(fileSrc, croppedArea);
      const file = new File([croppedBlob], 'advocacy-cover.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/advocacy/upload-image`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(res.data.url);
      setForm({ ...form, displayImage: res.data.url });
      setFileSrc(null);
      setToastInfo({ message: 'Image uploaded', type: 'success' });
    } catch (err) {
      setToastInfo({ message: 'Upload failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAdvocacy(form);
      setToastInfo({ message: 'Advocacy created successfully', type: 'success' });
      onSuccess?.();
      onClose();
    } catch (err) {
      setToastInfo({ message: 'Failed to create advocacy', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto font-poppins"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Advocacy</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Campaign title" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" rows={4} placeholder="Enter campaign description" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Cover Image</label>
            {form.displayImage && <img src={form.displayImage} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-3 border" />}
            <input type="file" accept="image/*" onChange={onFileChange} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#006837] file:text-white file:hover:bg-[#00592e] transition" />
          </div>

          {fileSrc && (
            <div className="space-y-4">
              <div className="relative w-full h-64 border border-gray-300 rounded-lg bg-gray-100">
                <Cropper image={fileSrc} crop={crop} zoom={zoom} aspect={16 / 9} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
              </div>
              <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-[#006837]" />
              <button type="button" onClick={uploadCroppedImage} className="w-full px-4 py-2 bg-[#006837] text-white rounded-lg hover:bg-[#00592e]">
                Upload Cropped Image
              </button>
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Goals</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.goals.map((goal, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {goal}
                  <button type="button" onClick={() => removeGoal(i)} className="ml-2">×</button>
                </span>
              ))}
            </div>
            <input value={goalInput} onChange={(e) => setGoalInput(e.target.value)} onKeyDown={handleGoalKeyDown} className="w-full px-4 py-2 border rounded-lg" placeholder="Type goal and press Enter or ," />
          </div>

          <div>
            <label className="block mb-1 font-medium">Toolkits</label>
            <div className="space-y-2 mb-2">
              {form.toolkits.map((tk, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <div>
                    <p className="text-sm font-semibold">{tk.label} ({tk.type})</p>
                    <p className="text-xs text-gray-500 break-all">{tk.url}</p>
                  </div>
                  <button onClick={() => removeToolkit(i)} className="text-red-600">×</button>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <input value={toolkitInput.label} onChange={(e) => setToolkitInput({ ...toolkitInput, label: e.target.value })} placeholder="Toolkit Label" className="px-4 py-2 border rounded" />
              <input value={toolkitInput.url} onChange={(e) => setToolkitInput({ ...toolkitInput, url: e.target.value })} placeholder="https://resource-link.com" className="px-4 py-2 border rounded" />
              <select value={toolkitInput.type} onChange={(e) => setToolkitInput({ ...toolkitInput, type: e.target.value as 'Toolkit' | 'Policy' })} className="px-4 py-2 border rounded">
                <option value="Toolkit">Toolkit</option>
                <option value="Policy">Policy</option>
              </select>
              <button type="button" onClick={addToolkit} className="bg-[#006837] text-white px-4 py-2 rounded">Add Toolkit</button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button type="submit" disabled={loading} className={`px-6 py-2 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-[#006837] hover:bg-[#00592e]'}`}>
              {loading ? 'Creating...' : 'Create Advocacy'}
            </button>
          </div>
        </form>

        {toastInfo && (
          <Toast message={toastInfo.message} type={toastInfo.type} onClose={() => setToastInfo(null)} />
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createCause } from '../../../services/causeService';
import Toast from '../../../components/Toast';
import compressImage from '../../../utils/ImageCompression';
import getCroppedImg from '../../../utils/getCroppedImg';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import RichTextEditor from '../../../components/inputs/RichTextEditor';
import { statesLGAWardList } from '../../../utils/StateLGAWard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  causeType: 'support' | 'demand';
}

export default function NewCauseModal({ isOpen, onClose, onSuccess, causeType }: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    richDescription: '',
    goals: [] as string[],
    targets: [] as string[],
    partners: [] as string[],
    causeType: '',
    scope: '',
    location: { state: '', lga: '', ward: '' },
    bannerImageUrl: '',
  });
  const [goalInput, setGoalInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['state', 'lga', 'ward'].includes(name)) {
      setForm({ ...form, location: { ...form.location, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'goals' | 'targets',
    inputValue: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (["Enter", ","].includes(e.key) && inputValue.trim()) {
      e.preventDefault();
      setForm({ ...form, [field]: [...form[field], inputValue.trim()] });
      setInput('');
    }
  };

  const removeTag = (field: 'goals' | 'targets', index: number) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  const onCropComplete = (_: any, areaPixels: any) => {
    setCroppedArea(areaPixels);
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

  const uploadCroppedImage = async () => {
    if (!fileSrc || !croppedArea) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(fileSrc, croppedArea);
      const file = new File([croppedBlob], 'cause-banner.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/causes/upload-image`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImagePreview(res.data.url);
      setForm({ ...form, bannerImageUrl: res.data.url });
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
      await createCause(form);
      setToastInfo({ message: 'Cause created successfully', type: 'success' });
      onSuccess?.();
      onClose();
    } catch (err) {
      setToastInfo({ message: 'Failed to create cause', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Cause</h2>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-500 hover:text-gray-700" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Cause name" className="w-full px-4 py-2 border rounded" />

          <div>
            <label className="block mb-1 font-medium">Short Description</label>
            <input name="description" value={form.description} onChange={handleChange} placeholder="Short description" className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Detailed Description</label>
            <RichTextEditor content={form.richDescription} onChange={(value) => setForm({ ...form, richDescription: value })} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Cause Type</label>
            <select name="causeType" value={form.causeType} onChange={handleChange} className="w-full px-4 py-2 border rounded">
              <option value="">Select type</option>
              <option value="Legislative Action">Legislative Action</option>
              <option value="Executive Action">Executive Action</option>
              <option value="Demand for Accountability">Demand for Accountability</option>
              <option value="Demand for Policy">Demand for Policy</option>
              <option value="Governance Request">Governance Request</option>
              <option value="Political Support for a Candidate">Political Support for a Candidate</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Scope</label>
            <select name="scope" value={form.scope} onChange={handleChange} className="w-full px-4 py-2 border rounded">
              <option value="">Select scope</option>
              <option value="National Cause">National Cause</option>
              <option value="State Cause">State Cause</option>
              <option value="LG Cause">LG Cause</option>
              <option value="Ward Cause">Ward Cause</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select name="state" value={form.location.state} onChange={handleChange} className="w-full px-4 py-2 border rounded">
                <option value="">State</option>
                {statesLGAWardList.map((s) => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>

              <select
                name="lga"
                value={form.location.lga}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">LGA</option>
                {(statesLGAWardList.find(s => s.state === form.location.state)?.lgas || []).map((lgaObj) => (
                  <option key={lgaObj.lga} value={lgaObj.lga}>
                    {lgaObj.lga
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </option>
                ))}
              </select>


              <select
                name="ward"
                value={form.location.ward}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Ward</option>
                {(
                  statesLGAWardList
                    .find(s => s.state === form.location.state)
                    ?.lgas.find(l => l.lga === form.location.lga)?.wards || []
                ).map((ward) => (
                  <option key={ward} value={ward}>
                    {ward
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </option>
                ))}
              </select>


            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Goals</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.goals.map((goal, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {goal}<button type="button" onClick={() => removeTag('goals', i)} className="ml-2">×</button>
                </span>
              ))}
            </div>
            <input value={goalInput} onChange={(e) => setGoalInput(e.target.value)} onKeyDown={(e) => handleTagInputKeyDown(e, 'goals', goalInput, setGoalInput)} placeholder="Type goal and press Enter or ," className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">{causeType === 'support' ? 'Decision Makers' : 'Target Candidates'}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.targets.map((target, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {target}<button type="button" onClick={() => removeTag('targets', i)} className="ml-2">×</button>
                </span>
              ))}
            </div>
            <input value={targetInput} onChange={(e) => setTargetInput(e.target.value)} onKeyDown={(e) => handleTagInputKeyDown(e, 'targets', targetInput, setTargetInput)} placeholder={`Add ${causeType === 'support' ? 'decision maker' : 'candidate'} (press comma or Enter)`} className="w-full px-4 py-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Cover Image</label>
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-3 border" />}
            <input type="file" accept="image/*" onChange={onFileChange} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#006837] file:text-white file:hover:bg-[#00592e] transition" />
          </div>

          {fileSrc && (
            <div className="space-y-4">
              <div className="relative w-full h-64 border border-gray-300 rounded-lg bg-gray-100">
                <Cropper image={fileSrc} crop={crop} zoom={zoom} aspect={16 / 9} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
              </div>
              <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-[#006837]" />
              <button type="button" onClick={uploadCroppedImage} className="w-full px-4 py-2 bg-[#006837] text-white rounded-lg hover:bg-[#00592e]">Upload Cropped Image</button>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <button type="submit" disabled={loading} className={`px-6 py-2 rounded-lg text-white font-medium ${loading ? 'bg-gray-400' : 'bg-[#006837] hover:bg-[#00592e]'}`}>
              {loading ? 'Creating...' : 'Create Cause'}
            </button>
          </div>
        </form>

        {toastInfo && <Toast message={toastInfo.message} type={toastInfo.type} onClose={() => setToastInfo(null)} />}
      </div>
    </div>
  );
}

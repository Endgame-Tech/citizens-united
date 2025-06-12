import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createCause } from '../../../services/causeService';
import Toast from '../../../components/Toast';
import compressImage from '../../../utils/ImageCompression';
import RichTextEditor from '../../../components/inputs/RichTextEditor';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../utils/getCroppedImg';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { statesLGAWardList } from '../../../utils/StateLGAWard';

export default function NewCausePage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    richDescription: '',
    goals: [] as string[],
    toolkits: [] as { label: string; url: string; type: string }[],
    scope: '',
    location: { state: '', lga: '', ward: '' },
    bannerImageUrl: '',
    causeType: '',
    targets: [] as string[],
    partners: [] as string[],
  });
  const [goalInput, setGoalInput] = useState('');
  const [partnerInput, setPartnerInput] = useState('');
  const [toolkitInput, setToolkitInput] = useState({ label: '', url: '', type: 'Toolkit' });
  const [targetInput, setTargetInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (success) navigate('/dashboard?tab=Mobilise');
  }, [success]);

  const handleBack = () => {
    navigate('/dashboard');
    sessionStorage.setItem('dashboardPage', 'Mobilise');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (['state', 'lga', 'ward'].includes(name)) {
      setForm({ ...form, location: { ...form.location, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'goals' | 'toolkits' | 'targets' | 'partners',
    inputValue: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (["Enter", ","].includes(e.key) && inputValue.trim()) {
      e.preventDefault();
      setForm({ ...form, [field]: [...form[field], inputValue.trim()] });
      setInput('');
    }
  };

  const removeTag = (field: 'goals' | 'toolkits' | 'targets', index: number) => {
    setForm((prevForm) => ({ ...prevForm, [field]: prevForm[field].filter((_, i) => i !== index) }));
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
      setSuccess(true);
    } catch (err) {
      setToastInfo({ message: 'Failed to create cause', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addToolkit = () => {
    if (!toolkitInput.label || !toolkitInput.url) return;
    setForm({ ...form, toolkits: [...form.toolkits, toolkitInput] });
    setToolkitInput({ label: '', url: '', type: 'Toolkit' });
  };

  const removeToolkit = (index: number) => {
    setForm({ ...form, toolkits: form.toolkits.filter((_, i) => i !== index) });
  };

  return (
    <section>
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

      <div className="max-w-3xl mx-auto px-4 py-8 font-poppins">
        <h1 className="text-2xl font-semibold mb-4">Create a New Cause</h1>
        <p className="mb-6 text-gray-600">Fill in the form below to start a new civic cause or demand campaign.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Cause name"
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Short description"
            className="w-full px-4 py-2 border rounded"
          />

          <RichTextEditor
            content={form.richDescription}
            onChange={(value) => setForm({ ...form, richDescription: value })}
          />

          <div>
            <label className="block mb-1 font-medium">Scope</label>
            <select
              name="scope"
              value={form.scope}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select Scope</option>
              <option value="National Cause">National Cause</option>
              <option value="State Cause">State Cause</option>
              <option value="LG Cause">LG Cause</option>
              <option value="Ward Cause">Ward Cause</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                name="state"
                value={form.location.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">State</option>
                {statesLGAWardList.map((stateObj) => (
                  <option key={stateObj.state} value={stateObj.state}>{stateObj.state}</option>
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
                  <option key={lgaObj.lga} value={lgaObj.lga}>{lgaObj.lga}</option>
                ))}
              </select>

              <select
                name="ward"
                value={form.location.ward}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Ward</option>
                {(statesLGAWardList
                  .find(s => s.state === form.location.state)
                  ?.lgas.find(l => l.lga === form.location.lga)?.wards || []).map((ward) => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Banner Image</label>
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-3 border" />}
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#006837] file:text-white file:hover:bg-[#00592e] transition"
            />
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

          <div>
            <label className="block mb-1 font-medium">Cause Type</label>
            <select
              name="causeType"
              value={form.causeType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select Cause Type</option>
              <option value="Legislative Action">Legislative Action</option>
              <option value="Executive Action">Executive Action</option>
              <option value="Demand for Accountability">Demand for Accountability</option>
              <option value="Demand for Policy">Demand for Policy</option>
              <option value="Governance Request">Governance Request</option>
              <option value="Political Support for a Candidate">Political Support for a Candidate</option>
              <option value="Voting Bloc">Voting Bloc</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {form.causeType === 'Governance Request' || form.causeType === 'Political Support for a Candidate'
                ? 'Target Candidates'
                : 'Decision Makers'}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.targets.map((target, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {target}<button type="button" onClick={() => removeTag('targets', i)} className="ml-2">×</button>
                </span>
              ))}
            </div>
            <input
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              onKeyDown={(e) =>
                handleTagInputKeyDown(e, 'targets', targetInput, setTargetInput)
              }
              placeholder="Type name and press Enter or ,"
              className="w-full px-4 py-2 border rounded"
            />
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
            <input
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => handleTagInputKeyDown(e, 'goals', goalInput, setGoalInput)}
              placeholder="Type goal and press Enter or ,"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Cause Partners</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.partners.map((goal, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {goal}<button type="button" onClick={() => removeTag('goals', i)} className="ml-2">×</button>
                </span>
              ))}
            </div>
            <input
              value={partnerInput}
              onChange={(e) => setPartnerInput(e.target.value)}
              onKeyDown={(e) => handleTagInputKeyDown(e, 'partners', partnerInput, setPartnerInput)}
              placeholder="Type partner and press Enter or ,"
              className="w-full px-4 py-2 border rounded"
            />
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
              <select value={toolkitInput.type} onChange={(e) => setToolkitInput({ ...toolkitInput, type: e.target.value })} className="px-4 py-2 border rounded">
                <option value="Toolkit">Toolkit</option>
                <option value="Policy">Policy</option>
              </select>
              <button type="button" onClick={addToolkit} className="bg-gray-800 max-w-[150px] text-white px-4 py-2 rounded-xl">Add Toolkit</button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#006837] text-white rounded hover:bg-[#005c30] transition"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Cause'}
          </button>
        </form>

        {toastInfo && (
          <Toast
            message={toastInfo.message}
            type={toastInfo.type}
            onClose={() => setToastInfo(null)}
          />
        )}
      </div>
    </section>
  );
}

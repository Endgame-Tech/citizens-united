import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { updateCause, uploadCauseBannerImage } from '../../../services/causeService';
import Toast from '../../../components/Toast';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';

type EditProps = {
  isOpen: boolean;
  cause: any;
  onClose: () => void;
  onSuccess: (updates: any) => void;
};

const CAUSE_TYPES = [
  'Legislative Action',
  'Executive Action',
  'Demand for Accountability',
  'Demand for Policy',
  'Governance Request',
  'Political Support for a Candidate',
  'Voting Bloc',
];

const SCOPE_TYPES = [
  'National Cause',
  'State Cause',
  'LG Cause',
  'Ward Cause'
];

// Utility function to get a cropped image from canvas
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas dimensions to the cropped size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
};

export default function EditCauseModal({
  isOpen,
  cause,
  onClose,
  onSuccess,
}: EditProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    goals: [] as string[],
    targets: [] as string[],
    partners: [] as string[],
    causeType: '',
    scope: '',
    location: {
      state: '',
      lga: '',
      ward: '',
    },
    bannerImageUrl: '',
    richDescription: '',
    toolkits: [] as { label: string; url: string; type: string }[],
  });

  // Image cropper states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [goalInput, setGoalInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [partnerInput, setPartnerInput] = useState('');
  const [newToolkit, setNewToolkit] = useState({ label: '', url: '', type: 'Toolkit' });
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(() => {
    // Check if there's a stored tab to activate
    const savedTab = sessionStorage.getItem('activeEditTab');
    // Clear the stored value after reading it
    if (savedTab) sessionStorage.removeItem('activeEditTab');
    // Return the saved tab or default to 'basic'
    return savedTab || 'basic';
  });

  useEffect(() => {
    if (cause) {
      setForm({
        name: cause.name || '',
        description: cause.description || '',
        goals: cause.goals || [],
        targets: cause.targets || [],
        partners: cause.partners || [],
        causeType: cause.causeType || '',
        scope: cause.scope || '',
        location: {
          state: cause.location?.state || '',
          lga: cause.location?.lga || '',
          ward: cause.location?.ward || '',
        },
        bannerImageUrl: cause.bannerImageUrl || '',
        richDescription: cause.richDescription || '',
        toolkits: cause.toolkits || [],
      });
    }
  }, [cause]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('Modal closed via ESC key');
        onClose();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (modalRef.current) {
      const firstInput = modalRef.current.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setForm({
        ...form,
        location: {
          ...form.location,
          [locationField]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'goals' | 'targets' | 'partners',
    inputValue: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (['Enter', ','].includes(e.key) && inputValue.trim()) {
      e.preventDefault();
      setForm({
        ...form,
        [field]: [...form[field], inputValue.trim()],
      });
      setInput('');
    }
  };

  const removeTag = (field: 'goals' | 'targets' | 'partners', index: number) => {
    setForm({
      ...form,
      [field]: form[field].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove empty toolkits
      const filteredToolkits = form.toolkits.filter(
        toolkit => toolkit.label.trim() !== '' && toolkit.url.trim() !== ''
      );

      const updates = {
        name: form.name,
        description: form.description,
        goals: form.goals,
        targets: form.targets,
        partners: form.partners,
        causeType: form.causeType,
        scope: form.scope,
        location: form.location,
        bannerImageUrl: form.bannerImageUrl,
        richDescription: form.richDescription,
        toolkits: filteredToolkits,
      };

      const updated = await updateCause(cause._id, updates);
      setToastInfo({ message: 'Cause updated', type: 'success' });
      onSuccess(updated);
      onClose();
    } catch (err) {
      console.error('Update Cause Error:', err);
      setToastInfo({ message: 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addToolkit = () => {
    if (newToolkit.label.trim() !== '' && newToolkit.url.trim() !== '') {
      setForm({
        ...form,
        toolkits: [...form.toolkits, { ...newToolkit }],
      });
      setNewToolkit({ label: '', url: '', type: 'Toolkit' });
    }
  };

  const removeToolkit = (index: number) => {
    setForm({
      ...form,
      toolkits: form.toolkits.filter((_, i) => i !== index),
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10 MB limit
        setToastInfo({ message: 'Image size exceeds 10MB', type: 'error' });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImage(reader.result);
          setCropperOpen(true);
          setActiveTab('media'); // Switch to media tab
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback(
    (_: any, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const uploadBannerImage = async () => {
    try {
      if (!uploadedImage || !croppedAreaPixels) {
        setToastInfo({ message: 'No image selected', type: 'error' });
        return;
      }

      setImageUploading(true);

      // Get the cropped image as a blob
      const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixels);

      // Convert blob to file
      const file = new File([croppedImage], "banner.jpg", { type: "image/jpeg" });

      // Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
      });

      // Upload to server
      const imageUrl = await uploadCauseBannerImage(compressedFile);

      // Update form with the new image URL
      setForm({
        ...form,
        bannerImageUrl: imageUrl,
      });

      // Close the cropper
      setCropperOpen(false);
      setUploadedImage(null);

      setToastInfo({ message: 'Banner image uploaded successfully', type: 'success' });
    } catch (error) {
      console.error('Banner image upload error:', error);
      setToastInfo({ message: 'Failed to upload banner image', type: 'error' });
    } finally {
      setImageUploading(false);
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
          role="dialog"
          aria-modal="true"
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 scale-100 sm:scale-105 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Cause</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-4 border-b">
            <nav className="flex flex-wrap -mb-px">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`mr-4 py-2 px-3 border-b-2 font-medium text-sm ${activeTab === 'basic'
                  ? 'border-[#006837] text-[#006837]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('classification')}
                className={`mr-4 py-2 px-3 border-b-2 font-medium text-sm ${activeTab === 'classification'
                  ? 'border-[#006837] text-[#006837]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Classification
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('targets')}
                className={`mr-4 py-2 px-3 border-b-2 font-medium text-sm ${activeTab === 'targets'
                  ? 'border-[#006837] text-[#006837]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Targets & Partners
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className={`mr-4 py-2 px-3 border-b-2 font-medium text-sm ${activeTab === 'location'
                  ? 'border-[#006837] text-[#006837]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Location
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`mr-4 py-2 px-3 border-b-2 font-medium text-sm ${activeTab === 'media'
                  ? 'border-[#006837] text-[#006837]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Media
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('toolkits')}
                className={`mr-4 py-2 px-3 border-b-2 font-medium text-sm ${activeTab === 'toolkits'
                  ? 'border-[#006837] text-[#006837]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Toolkits
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                    Cause Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter cause name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-600 mb-1">
                    Goals
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.goals.map((goal, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#006837]/10 text-[#006837] text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {goal}
                        <button
                          type="button"
                          onClick={() => removeTag('goals', index)}
                          className="ml-2 text-[#006837] hover:text-[#00592e] transition-colors"
                          aria-label={`Remove goal: ${goal}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    id="goals"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => handleTagInputKeyDown(e, 'goals', goalInput, setGoalInput)}
                    placeholder="Add goal (press comma or Enter)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
              </div>
            )}

            {/* Classification Tab */}
            {activeTab === 'classification' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="causeType" className="block text-sm font-medium text-gray-600 mb-1">
                    Cause Type
                  </label>
                  <select
                    id="causeType"
                    name="causeType"
                    value={form.causeType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  >
                    <option value="" disabled>Select a cause type</option>
                    {CAUSE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="scope" className="block text-sm font-medium text-gray-600 mb-1">
                    Scope
                  </label>
                  <select
                    id="scope"
                    name="scope"
                    value={form.scope}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  >
                    <option value="" disabled>Select a scope</option>
                    {SCOPE_TYPES.map(scope => (
                      <option key={scope} value={scope}>{scope}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Targets & Partners Tab */}
            {activeTab === 'targets' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="targets" className="block text-sm font-medium text-gray-600 mb-1">
                    Target Candidates / Decision Makers
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.targets.map((target, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#006837]/10 text-[#006837] text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {target}
                        <button
                          type="button"
                          onClick={() => removeTag('targets', index)}
                          className="ml-2 text-[#006837] hover:text-[#00592e] transition-colors"
                          aria-label={`Remove target: ${target}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    id="targets"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    onKeyDown={(e) => handleTagInputKeyDown(e, 'targets', targetInput, setTargetInput)}
                    placeholder="Add target (press comma or Enter)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>

                <div>
                  <label htmlFor="partners" className="block text-sm font-medium text-gray-600 mb-1">
                    Partners
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.partners.map((partner, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#006837]/10 text-[#006837] text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {partner}
                        <button
                          type="button"
                          onClick={() => removeTag('partners', index)}
                          className="ml-2 text-[#006837] hover:text-[#00592e] transition-colors"
                          aria-label={`Remove partner: ${partner}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    id="partners"
                    value={partnerInput}
                    onChange={(e) => setPartnerInput(e.target.value)}
                    onKeyDown={(e) => handleTagInputKeyDown(e, 'partners', partnerInput, setPartnerInput)}
                    placeholder="Add partner (press comma or Enter)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-600 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    name="location.state"
                    value={form.location.state}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        location: { ...form.location, state: e.target.value },
                      });
                    }}
                    placeholder="Enter state"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
                <div>
                  <label htmlFor="lga" className="block text-sm font-medium text-gray-600 mb-1">
                    Local Government Area (LGA)
                  </label>
                  <input
                    id="lga"
                    name="location.lga"
                    value={form.location.lga}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        location: { ...form.location, lga: e.target.value },
                      });
                    }}
                    placeholder="Enter LGA"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
                <div>
                  <label htmlFor="ward" className="block text-sm font-medium text-gray-600 mb-1">
                    Ward
                  </label>
                  <input
                    id="ward"
                    name="location.ward"
                    value={form.location.ward}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        location: { ...form.location, ward: e.target.value },
                      });
                    }}
                    placeholder="Enter ward"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                  />
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Banner Image
                  </label>

                  {cropperOpen ? (
                    <div className="space-y-4">
                      <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
                        <Cropper
                          image={uploadedImage || ''}
                          crop={crop}
                          zoom={zoom}
                          aspect={16 / 9}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Zoom:</span>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="flex-1"
                        />
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setCropperOpen(false);
                            setUploadedImage(null);
                          }}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={uploadBannerImage}
                          disabled={imageUploading}
                          className={`px-4 py-2 text-white rounded-lg ${imageUploading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#006837] hover:bg-[#00592e] transition-colors'
                            }`}
                        >
                          {imageUploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.bannerImageUrl ? (
                        <div className="space-y-3">
                          <div className="rounded-lg overflow-hidden border">
                            <img
                              src={form.bannerImageUrl}
                              alt="Banner"
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <div className="flex justify-between">
                            <p className="text-xs text-gray-500">
                              Banner image will be displayed at the top of your cause page.
                            </p>
                            <label
                              htmlFor="banner-image-upload"
                              className="cursor-pointer text-sm text-[#006837] hover:text-[#00592e] transition-colors"
                            >
                              Change Image
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                          <Upload className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="mb-2 text-sm text-gray-600">Upload a banner image for your cause</p>
                          <p className="text-xs text-gray-500 mb-4">Optimal dimensions: 1200 x 675 pixels</p>
                          <label
                            htmlFor="banner-image-upload"
                            className="px-4 py-2 bg-[#006837] text-white rounded-lg hover:bg-[#00592e] transition-colors cursor-pointer"
                          >
                            Select Image
                          </label>
                        </div>
                      )}

                      <input
                        type="file"
                        id="banner-image-upload"
                        onChange={handleImageSelect}
                        accept="image/jpeg,image/png,image/jpg"
                        className="sr-only"
                      />
                    </div>
                  )}
                </div>

                {/* Hidden input field to maintain the form.bannerImageUrl value for submission */}
                <input type="hidden" id="bannerImageUrl" name="bannerImageUrl" value={form.bannerImageUrl} />

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Rich Description
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    You can edit the rich description from the cause detail page.
                  </p>
                </div>
              </div>
            )}

            {/* Toolkits Tab */}
            {activeTab === 'toolkits' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">Current Toolkits</h3>
                  {form.toolkits.length === 0 ? (
                    <p className="text-sm text-gray-500">No toolkits added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {form.toolkits.map((toolkit, index) => (
                        <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border">
                          <div className="flex-1">
                            <p className="font-medium">{toolkit.label}</p>
                            <a
                              href={toolkit.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate block"
                            >
                              {toolkit.url}
                            </a>
                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                              {toolkit.type}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeToolkit(index)}
                            className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Remove toolkit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Add New Toolkit</h3>
                  <div className="grid gap-3">
                    <div>
                      <label htmlFor="toolkitLabel" className="block text-sm font-medium text-gray-600 mb-1">
                        Label
                      </label>
                      <input
                        id="toolkitLabel"
                        value={newToolkit.label}
                        onChange={(e) => setNewToolkit({ ...newToolkit, label: e.target.value })}
                        placeholder="Enter toolkit name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="toolkitUrl" className="block text-sm font-medium text-gray-600 mb-1">
                        URL
                      </label>
                      <input
                        id="toolkitUrl"
                        value={newToolkit.url}
                        onChange={(e) => setNewToolkit({ ...newToolkit, url: e.target.value })}
                        placeholder="Enter toolkit URL"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="toolkitType" className="block text-sm font-medium text-gray-600 mb-1">
                        Type
                      </label>
                      <select
                        id="toolkitType"
                        value={newToolkit.type}
                        onChange={(e) => setNewToolkit({ ...newToolkit, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006837] focus:border-[#006837] transition"
                      >
                        <option value="Toolkit">Toolkit</option>
                        <option value="Policy">Policy</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={addToolkit}
                      disabled={!newToolkit.label || !newToolkit.url}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${!newToolkit.label || !newToolkit.url
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#006837] text-white hover:bg-[#00592e] transition-colors'
                        }`}
                    >
                      <Plus className="w-4 h-4" /> Add Toolkit
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${loading ? 'bg-[#80a79a] cursor-not-allowed' : 'bg-[#006837] hover:bg-[#00592e]'
                  }`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
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
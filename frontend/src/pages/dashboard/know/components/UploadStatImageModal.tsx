import React, { useRef, useState } from "react";
import { uploadStatImage } from "../../../../services/stateOfNationImageService";
import imageCompressor from "../../../../utils/ImageCompression"; // Your existing utility

const UploadStatImageModal = ({ onClose, onUpload }: any) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      // Compress file before upload
      const { compressedFile, error } = await imageCompressor(file);
      if (error || !compressedFile) throw error || new Error('Compression failed');
      const img = await uploadStatImage(compressedFile);
      onUpload(img);
      onClose();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed font-poppins inset-0 z-50 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded-xl shadow-md w-[90vw] max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-4">Upload Stat Image</h2>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          className="mb-4"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 rounded border"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadStatImageModal;

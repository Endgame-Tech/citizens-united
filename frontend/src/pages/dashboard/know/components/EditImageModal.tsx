import React, { useRef, useState } from "react";
import { updateStatImage } from "../../../../services/stateOfNationImageService";
import imageCompressor from "../../../../utils/ImageCompression"; // Your existing utility

interface EditImageModalProps {
  imageId: string;
  imageTitle?: string;
  onClose: () => void;
  onUpdate: (updatedImage: any) => void;
}

const EditImageModal = ({ imageId, imageTitle, onClose, onUpdate }: EditImageModalProps) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      // Compress file before upload
      const { compressedFile, error } = await imageCompressor(file);
      if (error || !compressedFile) throw error || new Error('Compression failed');
      const img = await updateStatImage(imageId, compressedFile);
      onUpdate(img);
      onClose();
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed font-poppins inset-0 z-50 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded-xl shadow-md w-[90vw] max-w-sm"
      >
        <h2 className="text-lg font-semibold mb-4">Update Image{imageTitle ? `: ${imageTitle}` : ""}</h2>
        <p className="text-sm text-gray-600 mb-4">Choose a new image file to replace the current one.</p>
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
            className="px-4 py-2 rounded bg-green-600 text-white"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditImageModal;

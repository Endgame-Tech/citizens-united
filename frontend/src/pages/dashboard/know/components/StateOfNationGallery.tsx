import { useState, useEffect } from "react";
import { fetchStatImages, deleteStatImage, updateImagesOrder } from "../../../../services/stateOfNationImageService";
import UploadStatImageModal from "./UploadStatImageModal";
import EditImageModal from "./EditImageModal";
import Lightbox from "./Lightbox";
import { useUser } from "../../../../context/UserContext";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Edit, Trash2, Plus } from "lucide-react";

interface StatImage {
  _id: string;
  imageUrl: string;
  title?: string;
  createdAt?: string;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90%] shadow-xl">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const StateOfNationGallery = () => {
  const [images, setImages] = useState<StatImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    imageId: "",
    imageTitle: ""
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    imageId: "",
    imageTitle: ""
  });
  const [isDragging, setIsDragging] = useState(false);
  const { profile } = useUser();

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchStatImages();
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load images');
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  // Handle drag end for reordering
  const handleDragEnd = async (result: any) => {
    setIsDragging(false);

    if (!result.destination) return; // Dropped outside the list

    const reorderedImages = Array.from(images);
    const [reorderedItem] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, reorderedItem);

    setImages(reorderedImages);

    // Update order in backend if there's a change
    if (result.source.index !== result.destination.index) {
      try {
        const imageIds = reorderedImages.map(img => img._id);
        await updateImagesOrder(imageIds);
      } catch (err) {
        console.error("Failed to update image order", err);
        // Optionally show a message to the user that the order update failed
      }
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent, id: string, title?: string) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      imageId: id,
      imageTitle: title || "this image"
    });
  };

  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent, id: string, title?: string) => {
    e.stopPropagation();
    setEditModal({
      isOpen: true,
      imageId: id,
      imageTitle: title || ""
    });
  };

  // Handle image update from edit modal
  const handleImageUpdate = (updatedImage: StatImage) => {
    setImages(images.map(img => img._id === updatedImage._id ? updatedImage : img));
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStatImage(confirmModal.imageId);
      setImages(images => images.filter(img => img._id !== confirmModal.imageId));
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  if (isLoading) {
    return (
      <section className="py-10 px-4">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 px-4">
        <div className="text-center text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section className="">
      {profile?.role === "admin" && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow"
          >
            <Plus size={18} />
            <span>Add New Image</span>
          </button>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {images.map((img, i) => (
                <Draggable
                  key={img._id}
                  draggableId={img._id}
                  index={i}
                  isDragDisabled={!(profile?.role === "admin") || isDragging}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all 
                        ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-md'} 
                        ${profile?.role === "admin" ? 'hover:shadow-lg' : ''}`}
                      onClick={() => !isDragging && setLightboxIdx(i)}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.title || "State of Nation Stat"}
                        className="w-full h-full object-contain bg-gray-100"
                      />
                      {profile?.role === "admin" && (
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={(e) => handleEditClick(e, img._id, img.title)}
                            className="bg-blue-600 text-white p-2 rounded-full opacity-80 hover:opacity-100"
                            title="Edit image"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, img._id, img.title)}
                            className="bg-red-600 text-white p-2 rounded-full opacity-80 hover:opacity-100"
                            title="Delete image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      {profile?.role === "admin" && !snapshot.isDragging && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-1 px-2">
                          <p className="text-xs text-white/80">Drag to reorder</p>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {uploadOpen && (
        <UploadStatImageModal
          onClose={() => setUploadOpen(false)}
          onUpload={(img: StatImage) => setImages(prevImages => [img, ...prevImages])}
        />
      )}

      {editModal.isOpen && (
        <EditImageModal
          imageId={editModal.imageId}
          imageTitle={editModal.imageTitle}
          onClose={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
          onUpdate={handleImageUpdate}
        />
      )}

      {lightboxIdx !== null && !isDragging && (
        <Lightbox images={images} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title="Delete Image"
        message={`Are you sure you want to delete ${confirmModal.imageTitle}? This action cannot be undone.`}
      />
    </section>
  );
};

export default StateOfNationGallery;

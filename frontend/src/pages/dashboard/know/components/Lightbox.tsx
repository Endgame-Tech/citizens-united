import { useState } from "react";

const Lightbox = ({ images, startIdx, onClose }: any) => {
  const [idx, setIdx] = useState(startIdx);

  const prev = () => setIdx((i: number) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i: number) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center">
      <button className="absolute top-4 right-4 text-white text-2xl" onClick={onClose}>✕</button>
      <button className="absolute left-4 text-white text-2xl" onClick={prev}>⟨</button>
      <img
        src={images[idx].imageUrl}
        alt="stat"
        className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl shadow"
      />
      <button className="absolute right-4 text-white text-2xl" onClick={next}>⟩</button>
    </div>
  );
};

export default Lightbox;

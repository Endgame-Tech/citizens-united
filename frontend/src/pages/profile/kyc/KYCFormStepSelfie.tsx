import { useEffect, useRef, useState } from "react";
import NextButton from "../../../components/NextButton";

interface Props {
  initialData?: { selfieBlob?: Blob };
  onNext: (data: { selfieBlob: Blob; selfiePreviewUrl: string }) => void;
}

export default function KYCFormStepSelfie({ initialData, onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Unable to access camera. Please allow access.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        setSelfieBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      }
    }, "image/jpeg");
  };

  const handleRetake = () => {
    setSelfieBlob(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfieBlob) {
      alert("Please capture a selfie to proceed.");
      return;
    }
    onNext({ selfieBlob, selfiePreviewUrl: previewUrl! });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6 border">
        <div>
          <h2 className="text-2xl font-semibold text-[#006837]">Step 3: Capture Selfie</h2>
          <p className="text-sm text-gray-600 mt-1">
            Your face must be clearly visible and well-lit. This selfie will be used to verify your identity.
          </p>
        </div>

        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border bg-gray-100 flex justify-center items-center relative">
          {!previewUrl ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={previewUrl}
                alt="Selfie Preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 right-2 bg-white/90 text-xs px-2 py-1 rounded text-gray-700 font-medium shadow">
                Preview
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex justify-between gap-4 items-center">
          {!previewUrl ? (
            <button
              type="button"
              onClick={handleCapture}
              className="px-5 py-2 rounded-full bg-[#0f0f0f] hover:cursor-pointer text-white font-semibold hover:bg-[#343434] transition-colors"
            >
              Capture Selfie
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRetake}
              className="px-5 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Retake
            </button>
          )}

          <NextButton content="Finish" />
        </div>
      </div>
    </form>
  );
}

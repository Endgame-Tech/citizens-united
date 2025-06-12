import { useState, ChangeEvent } from "react";
import TextInput from "../../../components/inputs/TextInput";
import FormSelect from "../../../components/select/FormSelect";
import NextButton from "../../../components/NextButton";

interface ValidIDInfo {
  idType: string;
  idNumber: string;
  idImageFile: File | null;
}

interface Props {
  initialData?: ValidIDInfo;
  onNext: (data: ValidIDInfo) => void;
}

const idTypeOptions = [
  { id: 1, label: "National ID (NIN)", value: "NIN" },
  { id: 2, label: "Driver's License", value: "Driver's License" },
  { id: 3, label: "International Passport", value: "International Passport" },
];

export default function KYCFormStepValidID({ initialData, onNext }: Props) {
  const [formData, setFormData] = useState<ValidIDInfo>({
    idType: initialData?.idType || "",
    idNumber: initialData?.idNumber || "",
    idImageFile: initialData?.idImageFile || null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, idImageFile: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 max-w-3xl mx-auto mt-12">
      <h2 className="text-xl font-semibold text-[#006837]">Step 2: Upload Your Valid ID</h2>

      <FormSelect
        label="Select ID Type"
        options={idTypeOptions}
        defaultSelected={formData.idType}
        onChange={(opt) => {
          if (opt) setFormData({ ...formData, idType: opt.value });
        }}
        required
      />

      <TextInput
        label="ID Number"
        placeholder="e.g. 12345678901"
        value={formData.idNumber}
        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
        required
      />

      <div>
        <label className="block mb-2 font-medium text-sm text-gray-700">Upload ID Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm border rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-[#006837] file:text-white hover:file:bg-[#00552d]"
        />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="mt-4 rounded border max-h-60 object-contain" />
        )}
      </div>

      <div className="text-right">
        <NextButton content="Next" />
      </div>
    </form>
  );
}

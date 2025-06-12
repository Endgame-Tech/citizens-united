import { useState } from "react";
import KYCFormStepPersonalInfo from "./KYCFormStepPersonalInfo";
import KYCFormStepValidID from "./KYCFormStepValidID";
import KYCFormStepSelfie from "./KYCFormStepSelfie";
import Progressbar from "../../../components/Progressbar";
import { submitKYCData } from "../../../services/kycService";

export default function KYCFormWrapper() {
  const [step, setStep] = useState(1);

  const [personalInfo, setPersonalInfo] = useState(null);
  const [validID, setValidID] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const handleNext = (data: any) => {
    if (step === 1) setPersonalInfo(data);
    if (step === 2) setValidID(data);
    if (step === 3) setSelfie(data);
    setStep((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl w-full mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl mb-6 font-bold text-[#006837]">KYC Verification</h1>
        <Progressbar currentNumber={step} />
      </div>

      {step === 1 && (
        <KYCFormStepPersonalInfo
          initialData={personalInfo || undefined}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <KYCFormStepValidID
          initialData={validID || undefined}
          onNext={handleNext}
        />
      )}

      {step === 3 && (
        <KYCFormStepSelfie
          initialData={selfie || undefined}
          onNext={async (finalSelfieData) => {
            const finalPayload = {
              personalInfo,
              validID,
              selfie: finalSelfieData,
            };

            // ✅ Type guards to prevent calling the API with nulls
            if (!finalPayload.personalInfo || !finalPayload.validID || !finalPayload.selfie.selfieBlob) {
              alert("Incomplete KYC data. Please fill all steps.");
              return;
            }

            try {
              const response = await submitKYCData(
                finalPayload.personalInfo,
                finalPayload.validID,
                finalPayload.selfie.selfieBlob
              );

              console.log("✅ KYC submitted:", response);
              // Navigate or show success toast
            } catch (err: any) {
              console.error("❌ KYC submission failed:", err.response?.data || err.message);
              alert("Something went wrong while submitting your KYC.");
            }
          }}

        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { User, UserCheck, Briefcase, Award, Heart } from 'lucide-react';
import AssessorInfo from './stages/evaluation-stages/AssessorInfo';
import CandidateInfo from './stages/evaluation-stages/CandidateInfo';
import CapacitySection from './stages/evaluation-stages/CapacitySection';
import CompetenceSection from './stages/evaluation-stages/CompetenceSection';
import CharacterSection from './stages/evaluation-stages/CharacterSection';
import ResultPopup from './stages/evaluation-stages/ResultPopup';

interface EvaluationFormProps {
  closeModal: () => void;
}

interface EvaluationData {
  [key: string]: any;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ closeModal }) => {
  const [stage, setStage] = useState<number>(1);
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({});
  const [stageTransition, setStageTransition] = useState<boolean>(false);
  const [exitToMain, setExitToMain] = useState<boolean>(false);

  // Use useEffect to properly handle the closeModal call
  useEffect(() => {
    if (exitToMain) {
      closeModal();
    }
  }, [exitToMain, closeModal]);

  const handleCloseOrReset = () => {
    // Reset to the first stage
    setStage(1);
    setEvaluationData({});
  };

  // Add a function to exit to the main dashboard
  const handleExit = () => {
    setExitToMain(true);
  };

  const totalStages = 5;
  const stages = [
    { label: 'Assessor Info', icon: <User size={16} /> },
    { label: 'Candidate Info', icon: <UserCheck size={16} /> },
    { label: 'Capacity', icon: <Briefcase size={16} /> },
    { label: 'Competence', icon: <Award size={16} /> },
    { label: 'Character', icon: <Heart size={16} /> },
  ];

  const handleNext = (data: EvaluationData) => {
    setEvaluationData({ ...evaluationData, ...data });

    // Add transition effect
    setStageTransition(true);
    setTimeout(() => {
      setStage(stage + 1);
      setStageTransition(false);
    }, 300);
  };

  const getProgressColor = (index: number) => {
    if (stage > index + 1) return 'bg-[#006837] text-white'; // completed
    if (stage === index + 1) return 'bg-[#8cc63f] text-white'; // current
    return 'bg-gray-200 text-gray-500'; // upcoming
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Stepper */}
      <div className="mb-8 md:mb-10 overflow-x-auto pb-2">
        <div className="flex justify-between items-center min-w-[600px] px-2">
          {stages.map((stageItem, index) => (
            <div key={index} className="flex-1 text-center px-1">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors duration-300 ${getProgressColor(index)}`}
              >
                <span className="hidden sm:inline">{index + 1}</span>
                <span className="sm:hidden">{stageItem.icon}</span>
              </div>
              <p
                className={`mt-1 sm:mt-2 text-xs sm:text-sm font-medium truncate ${stage >= index + 1 ? 'text-[#006837]' : 'text-gray-500'
                  }`}
              >
                {stageItem.label}
              </p>
            </div>
          ))}
        </div>
        <div className="relative mt-2 md:mt-4 h-1 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-1 bg-[#006837] rounded-full transition-all duration-500"
            style={{ width: `${(stage / totalStages) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Stage Indicator */}
      <div className="bg-gray-50 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stage <= 5 && stages[stage - 1].icon}
          <h3 className="font-medium text-gray-800">
            {stage <= 5 ? `Stage ${stage}: ${stages[stage - 1].label}` : 'Results'}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">{stage} of {totalStages}</div>
          {stage === 6 && (
            <button
              onClick={handleExit}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 4V2.586L16.414 7H10z" clipRule="evenodd" />
              </svg>
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Form Stages */}
      <div className={`transition-opacity relative duration-300 ${stageTransition ? 'opacity-0' : 'opacity-100'}`}>
        {stage === 1 && <AssessorInfo onNext={handleNext} />}
        {stage === 2 && <CandidateInfo onNext={handleNext} />}
        {stage === 3 && <CapacitySection onNext={handleNext} />}
        {stage === 4 && <CompetenceSection onNext={handleNext} />}
        {stage === 5 && <CharacterSection onNext={handleNext} />}
        {stage === 6 && (
          <ResultPopup
            evaluationData={evaluationData}
            closeModal={handleCloseOrReset}
          />
        )}
      </div>
    </div>
  );
};

export default EvaluationForm;
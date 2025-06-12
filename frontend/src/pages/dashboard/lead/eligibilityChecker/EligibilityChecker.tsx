import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Award, CheckCircle, CircleUser } from 'lucide-react';
import EvaluationForm from './EvaluationForm';

export default function EligibilityChecker() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading resources
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
    sessionStorage.setItem('dashboardPage', 'Run for Office Hub');
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-6 sm:py-12 font-poppins overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center animate-fadeInUp">
          <div className="w-16 h-16 border-4 border-[#006837] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading evaluation framework...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-10 lg:p-12 border border-gray-200 transition-all ease-in-out duration-300 animate-fadeIn">
          {/* Back Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 sm:px-6 py-2 bg-[#006837] text-white rounded-lg hover:bg-[#00592e] transition-colors duration-200 shadow-sm"
              aria-label="Exit Eligibility Checker"
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Exit</span>
            </button>

            <div className="flex items-center">
              <Award size={18} className="text-[#006837] mr-2" />
              <span className="text-sm font-medium text-[#006837] hidden sm:inline">Citizens United</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 sm:mb-10 animate-fadeInUp">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#006837] mb-4">
              3Cs Eligibility Checker
            </h1>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base max-w-2xl mx-auto">
              Assess a candidate's leadership readiness using the 3Cs Framework: Capacity, Competence, and Character.
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
              <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 bg-[#006837]/10 rounded-full">
                <CheckCircle size={14} className="text-[#006837] flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#006837]">Capacity</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 bg-blue-50 rounded-full">
                <Award size={14} className="text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-blue-600">Competence</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 bg-purple-50 rounded-full">
                <CircleUser size={14} className="text-purple-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-purple-600">Character</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700 max-w-2xl mx-auto border border-blue-100 animate-fadeInUp">
              <p className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This evaluation helps identify leadership qualities based on a candidate's capacity, competence, and character. Results are intended for personal assessment only.
              </p>
            </div>
          </div>

          {/* Evaluation Form */}
          <div className="animate-fadeInUp">
            <EvaluationForm closeModal={() => navigate('/dashboard')} />
          </div>
        </div>
      )}
    </section>
  );
}
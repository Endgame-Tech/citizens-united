import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface SurveyAnswers {
  citizenship: string;
  isVoter: string;
  willVote: string;
}

interface PostLoginSurveyModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (answers: SurveyAnswers) => void;
  error?: string | null;
}

const defaultAnswers: SurveyAnswers = {
  citizenship: '',
  isVoter: '',
  willVote: '',
};

const PostLoginSurveyModal: React.FC<PostLoginSurveyModalProps> = ({
  open,
  loading = false,
  onClose,
  onSubmit,
  error,
}) => {
  const [answers, setAnswers] = useState<SurveyAnswers>(defaultAnswers);

  React.useEffect(() => {
    if (open) setAnswers(defaultAnswers);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          disabled={loading}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Quick Survey</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(answers);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-medium mb-1">Are you a Nigerian Citizen, Diasporan, or Foreigner?</label>
            <select
              name="citizenship"
              value={answers.citizenship}
              onChange={e => setAnswers(a => ({ ...a, citizenship: e.target.value }))}
              required
              className="w-full px-4 py-2 border rounded"
              disabled={loading}
            >
              <option value="">Select</option>
              <option value="Nigerian Citizen">Nigerian Citizen</option>
              <option value="Diasporan">Diasporan</option>
              <option value="Foreigner">Foreigner</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Are you a registered voter?</label>
            <select
              name="isVoter"
              value={answers.isVoter}
              onChange={e => setAnswers(a => ({ ...a, isVoter: e.target.value }))}
              required
              className="w-full px-4 py-2 border rounded"
              disabled={loading}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Will you vote in an election based on this cause?</label>
            <select
              name="willVote"
              value={answers.willVote}
              onChange={e => setAnswers(a => ({ ...a, willVote: e.target.value }))}
              required
              className="w-full px-4 py-2 border rounded"
              disabled={loading}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-[#006837] text-white rounded hover:bg-[#00592e]"
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default PostLoginSurveyModal;

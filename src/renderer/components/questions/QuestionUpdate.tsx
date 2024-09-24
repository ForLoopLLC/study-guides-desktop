import React, { useReducer, useEffect } from 'react';
import { useUpdateQuestion, useLocalStatus, useQuestionAI } from '../../hooks';
import { Question } from '../../../types';
import clsx from 'clsx';
import { FaClipboard } from 'react-icons/fa'; // Import a clipboard icon from react-icons
import QuestionCircle from './QuestionCircle';
import questionReducer from './questionReducer';
import { FaSpinner } from 'react-icons/fa';

interface QuestionUpdateProps {
  question?: Question; // Make tag optional to handle no tag case
  onUpdate: () => void; // Callback function to trigger after update
  isLoading: boolean;
  assistProcessing: boolean;
  publishProcessing: boolean;
}

const QuestionUpdate: React.FC<QuestionUpdateProps> = ({
  question,
  onUpdate,
  isLoading,
  assistProcessing,
  publishProcessing,
}) => {
  const {
    updateQuestion,
    isLoading: isUpdating,
    success: updateSuccess,
    error: updateError,
    resetStatus: resetUpdateStatus,
  } = useUpdateQuestion();



  const [state, dispatch] = useReducer(
    questionReducer,
    question || ({} as Question),
  );

  const { localSuccess, localError, resetStatus } = useLocalStatus(
    updateSuccess,
    updateError,
    false,
    null,
  );

  const { getQuestionInput, isLoading: aiLoading } = useQuestionAI();

  const isBusy = isLoading || isUpdating || assistProcessing || publishProcessing || aiLoading;

  const resetAllStatus = () => {
    resetUpdateStatus();
    resetStatus();
  };

  useEffect(() => {
    if (question) {
      dispatch({ type: 'RESET', payload: question });
      resetAllStatus();
    }
  }, [question]);

  const hasChanges = () => {
    return (
      state.questionText !== question?.questionText ||
      state.answerText !== question?.answerText ||
      state.learnMore !== question?.learnMore ||
      JSON.stringify(state.distractors) !==
        JSON.stringify(question?.distractors)
    );
  };

  const handleAssist = async () => {
    try {
      if (!question) return;
      const assist = await getQuestionInput(question.id);
      if (assist) {
        dispatch({
          type: 'SET_FIELDS',
          payload: {
            learnMore: assist.learnMore ?? state.learnMore,
            distractors: assist.distractors ?? state.distractors,
          },
        });
        window.alert(`AI Assist completed for ${question.id}`);
      }
    } catch (error) {
      const err = error as Error;
      window.alert(`Assist failed. ${err.message}`);
    }
  };

  const handleUpdate = async () => {
    if (question) {
      resetAllStatus();
      await updateQuestion(state);
      onUpdate();
    }
  };

  const handleCancel = () => {
    if (question) {
      dispatch({ type: 'RESET', payload: question });
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    dispatch({ type: 'SET_FIELD', field, value: array });
  };

  // Function to copy the tag ID to clipboard
  const copyToClipboard = async () => {
    if (question) {
      await navigator.clipboard.writeText(question.id);
      alert('Question ID copied to clipboard!');
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text');
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;

    // Get the current selection start and end positions
    const { selectionStart, selectionEnd, value } = target;

    // Insert clipboard data at the current cursor position
    const newValue =
      value.substring(0, selectionStart!) +
      clipboardData +
      value.substring(selectionEnd!);

    dispatch({ type: 'SET_FIELD', field, value: newValue });
  };

  if (!question) {
    return <p className="text-gray-500">Select a tag to edit</p>;
  }

  return (
    <div>
      {/* Display tag ID with copy-to-clipboard icon */}
      <div>
        <div
          key={question.id}
          className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
        >
          <QuestionCircle question={question} />
          <span className="text-lg mr-2">{question.questionText}</span>
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-gray-700"
            title="Copy to clipboard"
          >
            <FaClipboard />
          </button>
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1">Question:</label>
        <input
          type="text"
          value={state.questionText || ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'questionText',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'questionText')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Answer:</label>
        <input
          type="text"
          value={state.answerText || ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'answerText',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'answerText')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">LearnMore:</label>
        <textarea
          value={state.learnMore || ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'learnMore',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'learnMore')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">
          Distractors (comma-separated):
        </label>
        <textarea
          value={(state.distractors || []).join(', ')}
          onChange={(e) => handleArrayChange('distractors', e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <section className="mt-2 mb-2 min-h-[24px]">
        {localSuccess && <p className="text-green-500">{localSuccess}</p>}
        {localError && <p className="text-red-500">{localError}</p>}
      </section>

      <div className="flex space-x-4">
        <button
          onClick={handleUpdate}
          disabled={isBusy}
          className={clsx(
            'p-2 text-white rounded flex items-center justify-center disabled:opacity-50',
            isUpdating ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500',
          )}
        >
          {isUpdating ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : null}
          Update
        </button>

        <button
          onClick={handleCancel}
          disabled={!hasChanges() || isBusy}
          className={clsx(
            'p-2 rounded text-white',
            hasChanges() ? 'bg-orange-500' : 'bg-gray-300 cursor-not-allowed', // Gray when disabled
          )}
        >
          Cancel
        </button>
        <button
          onClick={handleAssist}
          disabled={isBusy}
          className={clsx(
            'p-2 text-white rounded flex items-center justify-center disabled:opacity-50',
            'bg-yellow-500', // Gray when disabled
          )}
        >
          {aiLoading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : null}
          Assist
        </button>
      </div>
    </div>
  );
};

export default QuestionUpdate;

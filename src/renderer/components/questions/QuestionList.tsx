import React from 'react';
import { Question } from '../../../types';
import QuestionCircle from './QuestionCircle';
import QuestionListMoreButton from './QuestionListMoreButton';

interface QuestionListProps {
  question: Question[]; // Adjust the type as needed for your tag object
  onClearReports: (question: Question) => void;
  onSelected: (question: Question) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  question,
  onSelected,
  onClearReports,
}) => {
  return (
    <ul id="question">
      {question.map((question) => (
        <li
          key={question.id}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded border-b"
        >
          <div
            onClick={() => onSelected(question)}
            className="flex items-center w-full"
          >
            <QuestionCircle question={question} />
            <span className="text-lg ml-2">{question.questionText}</span>
          </div>
          <QuestionListMoreButton
            question={question}
            handleClearReports={onClearReports}
          />
        </li>
      ))}
    </ul>
  );
};

export default QuestionList;

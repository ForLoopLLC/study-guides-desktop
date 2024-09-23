import React from 'react';
import { Question } from '@prisma/client';
import { useDeterministicColor } from '../../hooks';
import clsx from 'clsx';

interface QuestionCircleProps {
  question: Question;
}

const QuestionCircle: React.FC<QuestionCircleProps> = ({ question }) => {
  const {getColor} = useDeterministicColor();
  const color = getColor(question.questionText);

  const style = clsx(
    "w-8 h-8 flex items-center justify-center rounded-full text-white mr-3"
  );

  return (
    <div
      className={style}
      style={{ backgroundColor: color }}
    >
      {question.questionText?.slice(0, 1).toUpperCase()}
    </div>
  );
};

export default QuestionCircle;

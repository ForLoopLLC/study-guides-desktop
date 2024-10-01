import React from 'react';
import { Question } from '@prisma/client';
import Circle from '../Circle'; // Import the reusable Circle component
import { useDeterministicColor } from '../../hooks';

interface QuestionCircleProps {
  question: Question;
}

const QuestionCircle: React.FC<QuestionCircleProps> = ({ question }) => {
  const { getColor } = useDeterministicColor();
  const color = getColor(question.questionText); // Generate color based on question text
  const label = question.questionText?.slice(0, 1) || ''; // Get the first letter

  return <Circle label={label} backgroundColor={color} />;
};

export default QuestionCircle;

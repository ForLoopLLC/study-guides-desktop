import React from 'react';
import clsx from 'clsx';

interface CircleProps {
  label: string; // The letter or text to display inside the circle
  backgroundColor: string; // Background color for the circle
}

const Circle: React.FC<CircleProps> = ({ label, backgroundColor }) => {
  const style = clsx(
    "w-8 h-8 flex items-center justify-center rounded-full text-white mr-3"
  );

  return (
    <div className={style} style={{ backgroundColor }}>
      {label.toUpperCase()}
    </div>
  );
};

export default Circle;

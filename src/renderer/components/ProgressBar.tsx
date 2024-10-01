import React from 'react';

interface ProgressBarProps {
  progress: number;
  total: number;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  label,
}) => {
  const percentage = (progress / total) * 100;

  return (
    <div className="w-full mb-1">
      <div className="flex justify-between mb-1">
        <span className="text-sm truncate">{label}</span>
        <span className="text-sm">
          {progress}/{total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
export default ProgressBar;

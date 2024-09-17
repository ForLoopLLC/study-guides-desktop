import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  isLoading
}) => {
  return (
    <div className="mt-4 mb-4 flex items-center space-x-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1 || isLoading}
        className="p-2 bg-gray-300 rounded flex items-center justify-center disabled:opacity-50"
      >
        <FaArrowLeft className="text-xl" />
      </button>
      <p className="text-sm font-bold">
        Page {currentPage} of {totalPages}
      </p>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 bg-gray-300 rounded flex items-center justify-center disabled:opacity-50"
      >
        <FaArrowRight className="text-xl" />
      </button>
      <p className="text-sm font-bold">
          {totalRecords} records
        </p>
    </div>
  );
};

export default PaginationControls;

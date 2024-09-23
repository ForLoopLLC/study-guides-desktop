import { useState, useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { Question } from '../../../types';

interface QuestionListMoreButtonProps {
  question: Question; // Adjust the type as needed for your tag object
  handleClearReports: (tag: Question) => void;
}

const QuestionListMoreButton: React.FC<QuestionListMoreButtonProps> = ({
  question,
  handleClearReports,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null); // Ref to track the menu element

  const toggleMenu = (questionId: string) => {
    setOpenMenu(openMenu === questionId ? null : questionId);
  };

  // Function to detect clicks outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenu(null); // Close menu if clicked outside
    }
  };

  useEffect(() => {
    // Add event listener to detect outside clicks
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => toggleMenu(question.id)}
        className="ml-2 text-slate-700"
      >
        <FaEllipsisV />
      </button>
      {openMenu === question.id && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          <ul>
            <li
              onClick={() => {
                handleClearReports(question);
                setOpenMenu(null);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Clear Reports
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionListMoreButton;

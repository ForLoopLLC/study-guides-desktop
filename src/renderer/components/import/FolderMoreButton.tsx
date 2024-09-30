import { useState, useEffect, useRef } from 'react';
import { FaEllipsisV, FaTrash, FaDatabase, FaRobot } from 'react-icons/fa';

interface FolderMoreButtonProps {
  folderName: string;
  handleDelete: (folder: string) => void;
  handlePreParse: (folder: string) => void;
  handleAssist: (folder: string) => void;
}

const FolderMoreButton: React.FC<FolderMoreButtonProps> = ({
  folderName,
  handleDelete,
  handlePreParse,
  handleAssist,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = (folderName: string) => {
    setOpenMenu(openMenu === folderName ? null : folderName);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => toggleMenu(folderName)}
        className="ml-2 text-slate-700 hover:text-slate-900 focus:outline-none"
      >
        <FaEllipsisV className="text-xl" />
      </button>
      {openMenu === folderName && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
          <li
              onClick={() => {
                handleAssist(folderName);
                setOpenMenu(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              <FaRobot className="mr-3 text-slate-500" />
              <span>AI Assist</span>
            </li>
            <li
              onClick={() => {
                handlePreParse(folderName);
                setOpenMenu(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              <FaDatabase className="mr-3 text-slate-500" />
              <span>Pre-parse</span>
            </li>
            <li
              onClick={() => {
                handleDelete(folderName);
                setOpenMenu(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              <FaTrash className="mr-3 text-slate-500" />
              <span>Delete</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FolderMoreButton;

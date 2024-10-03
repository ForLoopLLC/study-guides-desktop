import { useState, useEffect, useRef } from 'react';
import {
  FaEllipsisV,
  FaRobot,
  FaFileExport,
} from 'react-icons/fa';
import clsx from 'clsx';

interface GlobalMoreButtonProps {
  disabled: boolean;
  folderName: string;
  handleAssistAll: (folder: string) => void;
  handleExportAll: (folder: string) => void;
}

const GlobalMoreButton: React.FC<GlobalMoreButtonProps> = ({
  disabled,
  folderName,
  handleAssistAll,
  handleExportAll,
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
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu(folderName);
        }}
        className="ml-2 text-slate-700 hover:text-slate-900 focus:outline-none"
      >
        <FaEllipsisV
          className={clsx('text-base', { 'text-slate-300': disabled })}
        />
      </button>
      {openMenu === folderName && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li
              onClick={() => {
                handleAssistAll(folderName);
                setOpenMenu(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              <FaRobot className="mr-3 text-slate-500" />
              <span>AI Assist All</span>
            </li>

            <li
              onClick={() => {
                handleExportAll(folderName);
                setOpenMenu(null);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              <FaFileExport className="mr-3 text-slate-500" />
              <span>Export All</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GlobalMoreButton;

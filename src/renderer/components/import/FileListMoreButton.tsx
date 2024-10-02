import { useState, useEffect, useRef } from 'react';
import { FaEllipsisV, FaTrash } from 'react-icons/fa';
import { ImportFile } from '../../../types';
import clsx from 'clsx';

interface FileListMoreButtonProps {
  disabled: boolean;
  file: ImportFile;
  handleDelete: (file: ImportFile) => void;
}

const FileListMoreButton: React.FC<FileListMoreButtonProps> = ({
  disabled,
  file,
  handleDelete,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = (fileName: string) => {
    setOpenMenu(openMenu === fileName ? null : fileName);
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
        onClick={() => toggleMenu(file.name)}
        className="ml-2 text-slate-700 hover:text-slate-900 focus:outline-none"
      >
        <FaEllipsisV
          className={clsx('text-xl', { 'text-slate-300': disabled })}
        />
      </button>
      {openMenu === file.name && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li
              onClick={() => {
                handleDelete(file);
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

export default FileListMoreButton;

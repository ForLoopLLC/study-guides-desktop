import { useState, useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { ImportFile } from '../../../types';

interface FileListMoreButtonProps {
  file: ImportFile; // Adjust the type as needed for your file object
  handleDelete: (file: ImportFile) => void;
  handlePreParse: (file: ImportFile) => void;
}

const FileListMoreButton: React.FC<FileListMoreButtonProps> = ({
  file,
  handleDelete,
  handlePreParse,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null); // Ref to track the menu element

  const toggleMenu = (tagId: string) => {
    setOpenMenu(openMenu === tagId ? null : tagId);
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
        onClick={() => toggleMenu(file.name)}
        className="ml-2 text-slate-700"
      >
        <FaEllipsisV />
      </button>
      {openMenu === file.name && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          <ul>
            <li
              onClick={() => {
                handlePreParse(file);
                setOpenMenu(null);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Pre-parse
            </li>
            <li
              onClick={() => {
                handleDelete(file);
                setOpenMenu(null);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
  
};

export default FileListMoreButton;

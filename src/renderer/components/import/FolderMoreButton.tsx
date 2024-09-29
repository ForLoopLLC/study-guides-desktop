import { useState, useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

interface FolderMoreButtonProps {
  folderName: string; // Adjust the type as needed for your folder object
  handleDelete: (folder: string) => void;
  handlePreParse: (folder: string) => void;
}

const FolderMoreButton: React.FC<FolderMoreButtonProps> = ({
  folderName,
  handleDelete,
  handlePreParse,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null); // Ref to track the menu element

  const toggleMenu = (folderName: string) => {
    setOpenMenu(openMenu === folderName ? null : folderName);
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
        onClick={() => toggleMenu(folderName)}
        className="ml-2 text-slate-700"
      >
        <FaEllipsisV />
      </button>
      {openMenu === folderName && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          <ul>
            <li
              onClick={() => {
                handlePreParse(folderName);
                setOpenMenu(null);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Pre-parse
            </li>
            <li
              onClick={() => {
                handleDelete(folderName);
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

export default FolderMoreButton;

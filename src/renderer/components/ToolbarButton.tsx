import { FaSpinner } from 'react-icons/fa';

interface ToolbarButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  disabled: boolean;
  label: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isProcessing,
  disabled,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
    >
      {isProcessing && <FaSpinner className="animate-spin mr-2" />}
      {label}
    </button>
  );
};

export default ToolbarButton;
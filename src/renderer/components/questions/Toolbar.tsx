import ToolbarButton from '../ToolbarButton';

interface ToolbarProps {
  disabled: boolean;
  isProcessing: boolean;
  handleUpdateIndexes: () => void;
  handleAiAssist: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  disabled,
  isProcessing,
  handleUpdateIndexes,
  handleAiAssist,
}) => {
  const buttonsDisabled =
    disabled || isProcessing;

  return (
    <section
      id="toolbar"
      className="flex flex-wrap gap-1 justify-start items-center border-2 p-2"
    >
      <ToolbarButton
        onClick={handleUpdateIndexes}
        isProcessing={isProcessing}
        disabled={buttonsDisabled}
        label="Update Indexes"
      />
      <ToolbarButton
        onClick={handleAiAssist}
        isProcessing={isProcessing}
        disabled={buttonsDisabled}
        label="Assist"
      />
    </section>
  );
};

export default Toolbar;

import ToolbarButton from '../ToolbarButton';

interface ToolbarProps {
  isProcessing: boolean;
  disabled: boolean;
  handleUpdateIndexes: () => void;
  handleAiAssist: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  isProcessing,
  disabled,
  handleUpdateIndexes,
  handleAiAssist,
}) => {
  const buttonsDisabled = disabled || isProcessing;

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
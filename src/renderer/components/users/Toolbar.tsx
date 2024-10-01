import ToolbarButton from '../ToolbarButton';

interface ToolbarProps {
  disabled: boolean;
  isProcessing: boolean;
  handleUpdateIndexes: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  disabled,
  isProcessing,
  handleUpdateIndexes,
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
    </section>
  );
};

export default Toolbar;

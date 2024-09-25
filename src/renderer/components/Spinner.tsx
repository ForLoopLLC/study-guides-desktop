import { FaSpinner } from 'react-icons/fa';

interface SpinnerProps {
  busy: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ busy }) => {
  if (!busy) return null;
  
  return (
    <div className='flex flex-row justify-center items-center pl-2 pr-2'>
      <FaSpinner className="animate-spin mr-2 text-slate-600" />
    </div>
  );
};

export default Spinner;

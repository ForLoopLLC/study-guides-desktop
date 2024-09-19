import React, { useEffect } from 'react';
import { useLogTail } from '../hooks/useLogTail';
import { FaEraser } from 'react-icons/fa'; // Importing Font Awesome icons

const LogViewer: React.FC = () => {
  const { logContent, startTail, stopTail, isTailing, clearLogs } = useLogTail();

  useEffect(() => {
    startTail(); // Start tailing logs on mount

    return () => {
      stopTail(); // Stop tailing logs on unmount
    };
  }, [startTail, stopTail]);

  return (
    <div>
      <div className="flex justify-center space-x-2 mb-4">
        <button
          className="flex items-center px-2 py-1 bg-slate-500 text-white rounded disabled:opacity-50"
          onClick={clearLogs}
        >
          <FaEraser className="mr-1" /> Clear
        </button>
      </div>

      <div>
        <pre className="text-xs whitespace-pre-wrap">{logContent}</pre>
      </div>
    </div>
  );
};

export default LogViewer;

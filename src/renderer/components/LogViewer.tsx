import React, { useEffect } from 'react';
import { useLogTail } from '../hooks/useLogTail'; // Adjust the path as needed

const LogViewer: React.FC = () => {
  const { logContent, startTail, stopTail } = useLogTail();

  useEffect(() => {
    // Start tailing logs on mount
    startTail();

    // Stop tailing logs on unmount
    return () => {
      stopTail();
    };
  }, [startTail, stopTail]);

  return (
    <div>
      <div>
        <h2>Log Output:</h2>
        <pre className="text-xs">{logContent}</pre>
      </div>
    </div>
  );
};

export default LogViewer;

import React, { ReactNode, useEffect, useState } from 'react';

interface PageProps {
  title: string;
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
  const [env, setEnv] = useState<'development' | 'test' | 'production'>(
    'development',
  );

  useEffect(() => {
    const handleEnvUpdate = (newEnv: any) => {
      setEnv(newEnv);
    };

    // Listen for environment updates from the main process
    const removeListener = window.electron.ipcRenderer.on('env-update', handleEnvUpdate);

    return () => {
      removeListener();
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl bg-blue-400 p-4 text-slate-50 font-bold">
        {title}
      </h1>
      <p>Environment:{env}</p>
      <div>{children}</div>
    </div>
  );
};

export default Page;

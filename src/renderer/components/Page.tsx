import React, { ReactNode } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface PageProps {
  title: string;
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
  const appContext = useAppContext();

  return (
    <div>
      <h1 className="text-3xl bg-blue-400 p-4 text-slate-50 font-bold">
        {title}
      </h1>
      <p>Environment:{appContext.environment.env}</p>
      <p>Url:{appContext.environment.url}</p>
      <div>{children}</div>
    </div>
  );
};

export default Page;

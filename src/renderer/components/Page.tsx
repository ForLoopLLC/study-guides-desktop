import React, { ReactNode, useEffect } from 'react';

interface PageProps {
  title: string;
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
  return (
    <div>
      <h1 className="text-3xl bg-blue-400 p-4 text-slate-50 font-bold">
        {title}
      </h1>
      <p>Environment:</p>
      <div>{children}</div>
    </div>
  );
};

export default Page;

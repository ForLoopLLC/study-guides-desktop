import React, { ReactNode } from 'react';
import { useAppContext } from '../contexts/AppContext';
import clsx from 'clsx';
import PostgresTable from './PostgresTable';

interface PageProps {
  title: string;
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
  const appContext = useAppContext();

  const headerClass = clsx(
    'p-4', // Base classes
    {
      'bg-gray-500': appContext.environment.env === 'development', // Gray for development
      'bg-green-500': appContext.environment.env === 'test', // Green for test
      'bg-red-500': appContext.environment.env === 'production', // Red for production
      'bg-blue-400': !['development', 'test', 'production'].includes(
        appContext.environment.env || '',
      ), // Default color
    },
  );

  return (
    <article>
      <header className={headerClass}>
        <h1 className="text-3xl text-slate-50 font-bold">
          {title} ({appContext.environment.env})
        </h1>
        <section className="p-4">
          <PostgresTable url={appContext.environment.url || ''} />
        </section>
      </header>
      <main className="p-4">{children}</main>
    </article>
  );
};

export default Page;

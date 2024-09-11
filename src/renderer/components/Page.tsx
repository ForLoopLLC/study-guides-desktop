import React, { useState, ReactNode } from 'react';
import { useAppContext } from '../contexts/AppContext';
import clsx from 'clsx';
import PostgresTable from './PostgresTable';

interface PageProps {
  title: string;
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
  const appContext = useAppContext();
  const [isPostgresVisible, setIsPostgresVisible] = useState(false); // State to track visibility

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

  const togglePostgresVisibility = () => {
    setIsPostgresVisible((prev) => !prev); // Toggle visibility state
  };

  return (
    <article>
      <header className={headerClass}>
        <h1
          className="text-3xl text-slate-50 font-bold cursor-pointer"
          onClick={togglePostgresVisibility} // Toggle visibility on click
        >
          {title} ({appContext.environment.env})
        </h1>
        {isPostgresVisible && ( // Conditionally render PostgresTable
          <section className="p-4">
            <PostgresTable url={appContext.environment.url || ''} />
          </section>
        )}
      </header>
      <main className="p-4">{children}</main>
    </article>
  );
};

export default Page;

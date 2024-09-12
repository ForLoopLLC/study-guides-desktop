import React from 'react';
import { Page } from '../components';

const Home = () => {
  return (
    <Page title="">
      <section className="h-full w-full bg-gray-50 p-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to the Admin Console
          </h1>
          <p className="text-lg text-gray-600">
            There’s no data here yet, but as development continues, the
            dashboard will display important insights and metrics.
          </p>
        </header>

        <main className="flex items-center justify-center mt-10">
          <div className="text-center"></div>
        </main>
      </section>
    </Page>
  );
};

export default Home;

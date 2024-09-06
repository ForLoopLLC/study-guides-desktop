import React from 'react';
import { Link } from 'react-router-dom';
import "tailwindcss/tailwind.css";

const Home = () => {
  return (
    <div className="p-4">
      <div className="text-lg text-blue-900">Home</div>
      <ul>
        <li>
          <Link to="/ai">AI</Link>
        </li>
        <li>
          <Link to="/database">Database</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;

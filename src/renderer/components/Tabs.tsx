// components/Tabs.tsx

import React, { useState } from 'react';

type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  children: (activeTabId: string) => React.ReactNode; // Function as children
};

const Tabs: React.FC<TabsProps> = ({ tabs, children }) => {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '');

  const handleTabChange = (id: string) => {
    setActiveTabId(id);
  };

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm ${
                activeTabId === tab.id
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : ''
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {children(activeTabId)} {/* Render children based on activeTabId */}
      </div>
    </div>
  );
};

export default Tabs;

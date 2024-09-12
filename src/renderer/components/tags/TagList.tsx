import React, { useState } from 'react';
import { useGetTags } from '../../hooks';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { TagType } from '@prisma/client';
import { useAppContext } from '../../contexts/AppContext';
import { TagFilter } from '../../../types';
import { TagUpdate } from '../../components';
import TagTypeCircle  from './TagTypeCircle';

const TagList: React.FC = () => {
  const [filter, setFilter] = useState<TagFilter>('All');
  const appContext = useAppContext();
  const count = 15;
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState(null); // State to track selected tag for editing
  const { tags, refetch, total, isLoading, error } = useGetTags(
    page,
    count,
    filter,
    appContext.environment,
  );
  const [activeTab, setActiveTab] = useState<'edit' | 'tree'>('edit'); // Control the active tab

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const totalPages = Math.ceil(total / count);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as TagFilter);
    setPage(1);
    setSelectedTag(null); // Reset selected tag when filter changes
  };

  const handleTagClick = (tag: any) => {
    setSelectedTag(tag); // Set the clicked tag for editing
  };

  const handleTagUpdated = () => {
    refetch(); // Refetch the tag list after a tag is updated
  };

  return (
    <div>
      {/* Toolbar */}
      <section
        id="toolbar"
        className="flex flex-wrap gap-1 justify-start items-center border-2 p-2"
      >
        <button
          disabled={tags.length === 0 || isLoading} // Disable button if no tags or loading
          className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
        >
          Update Indexes
        </button>
      </section>

      {/* Pagination and filter controls */}
      <div className="mt-4 mb-4 flex items-center space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isLoading} // Disable during loading
          className="p-2 bg-gray-300 rounded flex items-center justify-center disabled:opacity-50"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <p className="text-sm font-bold">
          Page {page} of {totalPages} ({total} tags)
        </p>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || isLoading || tags.length === 0} // Disable during loading
          className="p-2 bg-gray-300 rounded flex items-center justify-center disabled:opacity-50"
        >
          <FaArrowRight className="text-xl" />
        </button>
        <div className="flex-grow">
          <label htmlFor="filter" className="mr-2 font-bold">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            disabled={isLoading} // Disable filter during loading
            className="p-2 border rounded"
          >
            <option value="All">All</option>
            {Object.keys(TagType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags and Tabs */}
      <div className="flex">
        {/* Tags list */}
        <ul id="tags" className="w-1/2 pr-4 border-r">
          {tags.map((tag) => (
            <li
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              <TagTypeCircle type={tag.type} />
              <span className="text-lg">{tag.name}</span>
            </li>
          ))}
        </ul>

        {/* Tabs and content */}
        <div className="w-1/2 pl-4">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4">
              <button
                className={`px-4 py-2 text-sm ${
                  activeTab === 'edit' ? 'text-blue-500 border-b-2 border-blue-500' : ''
                }`}
                onClick={() => setActiveTab('edit')}
              >
                Edit
              </button>
              <button
                className={`px-4 py-2 text-sm ${
                  activeTab === 'tree' ? 'text-blue-500 border-b-2 border-blue-500' : ''
                }`}
                onClick={() => setActiveTab('tree')}
              >
                Tag Tree
              </button>
            </nav>
          </div>

          <div className="mt-4">
            {activeTab === 'edit' && selectedTag ? (
              <TagUpdate tag={selectedTag} onUpdate={handleTagUpdated} />
            ) : activeTab === 'tree' ? (
              <div>
                <h2 className="text-lg font-bold">Tag Tree</h2>
                {/* Tag tree content goes here */}
                <p>Tag Tree Display (to be built)</p>
              </div>
            ) : (
              <p className="text-gray-500">Select a tag to edit</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagList;

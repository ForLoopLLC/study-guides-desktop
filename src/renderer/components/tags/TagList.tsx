import React, { useState } from 'react';
import { useGetTags, usePublishIndex } from '../../hooks';
import { FaArrowLeft, FaArrowRight, FaSpinner } from 'react-icons/fa'; // Import FaSpinner for loading spinner
import { TagType } from '@prisma/client';
import { useAppContext } from '../../contexts/AppContext';
import { TagFilter } from '../../../types';
import { TagUpdate } from '../../components';

// Map each TagType to a color
const tagTypeColors: Record<TagType, string> = {
  [TagType.Category]: 'bg-blue-500',
  [TagType.SubCategory]: 'bg-green-500',
  [TagType.University]: 'bg-red-500',
  [TagType.Region]: 'bg-yellow-500',
  [TagType.Department]: 'bg-purple-500',
  [TagType.Course]: 'bg-teal-500',
  [TagType.Topic]: 'bg-pink-500',
  [TagType.UserFolder]: 'bg-orange-500',
};

// Helper function to get the first letter of the tag type
const getTagTypeLetter = (type: TagType) => TagType[type][0];

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
  const {
    publishIndex,
    isLoading: isPublishLoading,
    progress,
    totalProcessed,
    isComplete,
    error: publishError,
  } = usePublishIndex(filter, appContext.environment);

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

  const handleUpdateIndexes = async () => {
    publishIndex();
  };

  return (
    <div>
      <section
        id="toolbar"
        className="flex flex-wrap gap-1 justify-start items-center border-2 p-2"
      >
        <button
          onClick={handleUpdateIndexes}
          disabled={tags.length === 0 || isLoading} // Disable button if no tags or loading
          className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" /> // Add spinner when loading
          ) : null}
          Update Indexes
        </button>
      </section>
      <section id="messagebar" className="mt-4 p-4 border bg-gray-100 rounded">
        {isPublishLoading && (
          <p>
            Publishing in progress: {progress}% ({totalProcessed} tags
            processed)
          </p>
        )}
        {isComplete && (
          <p className="text-green-500">
            Indexing complete! {totalProcessed} tags processed.
          </p>
        )}
        {publishError && <p className="text-red-500">Error: {publishError}</p>}
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

      {/* Tags and edit form side by side */}
      <div className="flex">
        {/* Tags list */}
        <ul id="tags" className="w-1/2 pr-4 border-r">
          {tags.map((tag) => (
            <li
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white mr-3 ${tagTypeColors[tag.type]}`}
              >
                {getTagTypeLetter(tag.type)}
              </div>
              <span className="text-lg">{tag.name}</span>
            </li>
          ))}
        </ul>

        {/* Edit form */}
        <div className="w-1/2 pl-4">
          {selectedTag ? (
            <TagUpdate tag={selectedTag} onUpdate={handleTagUpdated} />
          ) : (
            <p className="text-gray-500">Select a tag to edit</p>
          )}
        </div>
        {/* Tag Tree display */}
        <div id="tag tree">

        </div>
      </div>
    </div>
  );
};

export default TagList;

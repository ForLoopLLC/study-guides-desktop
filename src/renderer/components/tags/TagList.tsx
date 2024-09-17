import React, { useState, useEffect } from 'react';
import {
  useGetTags,
  usePublishIndex,
  useGetTagWithRelations,
} from '../../hooks';
import { FaSpinner } from 'react-icons/fa';
import { TagType } from '@prisma/client';
import { useAppContext } from '../../contexts/AppContext';
import { TagFilter, Tag } from '../../../types';
import { TagUpdate, PaginationControls, FilterSelect } from '../../components';
import TagTypeCircle from './TagTypeCircle';
import TagTree from './TagTree';

const TagList: React.FC = () => {
  const [filter, setFilter] = useState<TagFilter>('All');
  const appContext = useAppContext();
  const count = 15;
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null); // State to track selected tag for editing
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

  const { tag: tagWithRelations, fetchTag } = useGetTagWithRelations();

  const [activeTab, setActiveTab] = useState<'edit' | 'tree'>('edit'); // Control the active tab

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const totalPages = Math.ceil(total / count);

  const handleFilterChange = (filter: TagFilter) => {
    setFilter(filter);
    setPage(1);
    setSelectedTag(null);
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

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const getTagFilterLabel = (option: TagFilter) => option;
  const getTagFilterValue = (option: TagFilter) => option;


  useEffect(() => {
    if (selectedTag) {
      fetchTag(selectedTag.id); // Refetch the tag list after indexing is complete
    }
  }, [selectedTag]);

  return (
    <div>
      {/* Toolbar */}
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
          <p>Publishing in progress: ({totalProcessed} tags processed)</p>
        )}
        {isComplete && (
          <p className="text-green-500">
            Indexing complete! {totalProcessed} tags processed.
          </p>
        )}
        {publishError && <p className="text-red-500">Error: {publishError}</p>}
      </section>

      <PaginationControls
        currentPage={page}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        totalRecords={total}
        isLoading={isLoading}
      />
      <div className="mt-4 mb-4 flex items-center space-x-4">
        <FilterSelect
          value={filter}
          onChange={handleFilterChange}
          options={['All', ...Object.keys(TagType) as TagFilter[]]} // Ensure the filter options match the type
          disabled={isLoading}
          label="Filter:"
          getOptionLabel={getTagFilterLabel}
          getOptionValue={getTagFilterValue}
        />
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
                  activeTab === 'edit'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : ''
                }`}
                onClick={() => setActiveTab('edit')}
              >
                Edit
              </button>
              <button
                className={`px-4 py-2 text-sm ${
                  activeTab === 'tree'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : ''
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
                {tagWithRelations && (
                  <TagTree
                    tag={tagWithRelations}
                    onSelected={(tag) => setSelectedTag(tag)}
                  />
                )}
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

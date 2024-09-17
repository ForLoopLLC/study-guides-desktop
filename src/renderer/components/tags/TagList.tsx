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
import {
  TagUpdate,
  PaginationControls,
  FilterSelect,
  Tabs,
} from '../../components';
import TagTypeCircle from './TagTypeCircle';
import TagTree from './TagTree';

const TagList: React.FC = () => {
  const [filter, setFilter] = useState<TagFilter>('All');
  const appContext = useAppContext();
  const count = 15;
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const { tags, refetch, total, isLoading, error } = useGetTags(
    page,
    count,
    filter,
    appContext.environment,
  );

  const {
    publishIndex,
    isLoading: processing,
    progress,
    totalProcessed,
    isComplete,
    error: processingError,
  } = usePublishIndex(filter, appContext.environment);

  const { tag: tagWithRelations, fetchTag } = useGetTagWithRelations();

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
    setSelectedTag(tag);
  };

  const handleTagUpdated = () => {
    refetch();
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
      fetchTag(selectedTag.id);
    }
  }, [selectedTag]);

  return (
    <div>
      {/* Toolbar and Message Bar */}
      <section
        id="toolbar"
        className="flex flex-wrap gap-1 justify-start items-center border-2 p-2"
      >
        <button
          onClick={handleUpdateIndexes}
          disabled={tags.length === 0 || isLoading}
          className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
          Update Indexes
        </button>
      </section>

      <section id="messagebar" className="mt-4 p-4 border bg-gray-100 rounded">
        {processing && (
          <p>Indexing in progress: ({totalProcessed} tags processed)</p>
        )}
        {isComplete && (
          <p className="text-green-500">
            Indexing complete! {totalProcessed} tags processed.
          </p>
        )}
        {processingError && (
          <p className="text-red-500">Error: {processingError}</p>
        )}
      </section>

      <div className="mt-4 mb-4 flex items-center space-x-4">
        <FilterSelect
          value={filter}
          onChange={handleFilterChange}
          options={['All', ...(Object.keys(TagType) as TagFilter[])]}
          disabled={isLoading}
          label="Filter:"
          getOptionLabel={getTagFilterLabel}
          getOptionValue={getTagFilterValue}
        />
      </div>

      <PaginationControls
        currentPage={page}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        totalRecords={total}
        isLoading={isLoading}
      />

      <div className="flex mt-4">
        {/* Left Section */}
        <div className="w-1/2 pr-4 border-r">
          <Tabs
            tabs={[
              { id: 'records', label: 'Records' },
              { id: 'logs', label: 'Logs' },
            ]}
          >
            {(activeTabId) => (
              <>
                {activeTabId === 'records' && (
                  <ul id="tags">
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
                )}
                {activeTabId === 'logs' && (
                  <div>
                    {/* Logs content placeholder */}
                    <p>Logs content will be here.</p>
                  </div>
                )}
              </>
            )}
          </Tabs>
        </div>

        {/* Right Section */}
        <div className="w-1/2 pl-4">
          <Tabs
            tabs={[
              { id: 'edit', label: 'Edit' },
              { id: 'tree', label: 'Tag Tree' },
            ]}
          >
            {(activeTabId) => (
              <>
                {activeTabId === 'edit' && (
                  <TagUpdate
                    tag={selectedTag || undefined}
                    onUpdate={handleTagUpdated}
                  />
                )}
                {activeTabId === 'tree' ? (
                  <div>
                    {tagWithRelations && (
                      <TagTree
                        tag={tagWithRelations}
                        onSelected={(tag) => setSelectedTag(tag)}
                      />
                    )}
                  </div>
                ) : null}
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TagList;

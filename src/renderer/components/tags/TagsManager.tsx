import React, { useState, useEffect } from 'react';
import {
  useGetTags,
  usePublishIndex,
  useGetTagWithRelations,
  useClearTagReports,
  useDeleteTag,
  useBatchAI,
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
  LogViewer,
} from '..';
import TagTree from './TagTree';
import Search from '../SearchBar';
import TagList from './TagList';

const TagsManager: React.FC = () => {
  const [filter, setFilter] = useState<TagFilter>('All');
  const appContext = useAppContext();
  const count = 15;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const { clearReports, isLoading: clearingLoading } = useClearTagReports();

  const {
    deleteTag,
    isLoading: isDeleting,
    success: deleteSuccess,
    error: deleteError,
    resetStatus: resetDeleteStatus,
  } = useDeleteTag();

  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const { tags, refetch, total, isLoading, error } = useGetTags(
    page,
    count,
    filter,
    query,
    appContext.environment,
  );

  const {
    publishIndex,
    isLoading: publishProcessing,
    progress: publishProgress,
    totalProcessed: totalPublished,
    isComplete: publishComplete,
    error: publishError,
  } = usePublishIndex(filter, query, appContext.environment);

  const {
    batchAiAssist,
    isLoading: assistProcessing,
    progress: assistProgress,
    totalProcessed: totalAssisted,
    isComplete: assistComplete,
    error: assistError,
  } = useBatchAI(filter, query, appContext.environment);

  const { tag: tagWithRelations, fetchTag, reset } = useGetTagWithRelations();

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const totalPages = Math.ceil(total / count);

  const handleAiAssist = async () => {
    await batchAiAssist();
    await refetch();
  };

  const handleFilterChange = (filter: TagFilter) => {
    setSelectedTag(null);
    reset();
    setFilter(filter);
    setPage(1);
  };

  const handleTagClick = (tag: any) => {
    setSelectedTag(tag);
  };

  const handleTagUpdated = () => {
    refetch();
  };

  const handleUpdateIndexes = async () => {
    await publishIndex();
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    setSelectedTag(null);
  };

  const handleDelete = async (tag: Tag) => {
    if (window.confirm(`Are you sure you want to delete ${tag.name}?`)) {
      try {
        const result = await deleteTag(tag.id);
        await refetch();
        reset();
        setSelectedTag(null);
        if (result) {
          window.alert('Tag deleted successfully');
        }
      } catch (error) {
        window.alert('Error deleting tag');
      }
    }
  };

  const handleClearReports = async (tag: Tag) => {
    if (
      window.confirm(`Are you sure you want to clear reports for ${tag.name}?`)
    ) {
      try {
        await clearReports(tag.id);
        await refetch();
        window.alert('Reports cleared successfully');
      } catch (error) {
        window.alert('Error clearing reports');
      }
    }
  };

  const getTagFilterLabel = (option: TagFilter) => option;
  const getTagFilterValue = (option: TagFilter) => option;

  useEffect(() => {
    if (selectedTag) {
      fetchTag(selectedTag.id);
    }
  }, [selectedTag]);

  useEffect(() => {
    setPage(1);
    setSelectedTag(null);
  }, [appContext.environment]);

  return (
    <div>
      {/* Toolbar and Message Bar */}
      <section
        id="toolbar"
        className="flex flex-wrap gap-1 justify-start items-center border-2 p-2"
      >
        <button
          onClick={handleUpdateIndexes}
          disabled={tags.length === 0 || isLoading || publishProcessing}
          className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
        >
          {publishProcessing ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : null}
          Update Indexes
        </button>
        <button
          onClick={handleAiAssist}
          disabled={tags.length === 0 || isLoading || publishProcessing}
          className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
        >
          {publishProcessing ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : null}
          Assist
        </button>
      </section>

      <section id="messagebar" className="mt-4 p-4 border bg-gray-100 rounded">
        {/* progress display */}
        {publishProcessing && (
          <p>Indexing in progress: ({totalPublished} tags published)</p>
        )}
        {assistProcessing && (
          <p>Indexing in progress: ({totalAssisted} tags assisted)</p>
        )}
        {/* completed display */}
        {publishComplete && (
          <p className="text-green-500">
            Indexing complete! {totalPublished} tags published.
          </p>
        )}

        {assistComplete && (
          <p className="text-green-500">
            Assist complete! {totalAssisted} tags assisted.
          </p>
        )}
        {/* error display */}
        {publishError && <p className="text-red-500">Error: {publishError}</p>}
        {assistError && <p className="text-red-500">Error: {assistError}</p>}
      </section>

      <section className="mt-4 mb-4 flex flex-row">
        <div className="mr-3">
          <Search
            query={query}
            setQuery={setQuery}
            onUpdate={() => setPage(1)}
          />
        </div>
        <FilterSelect
          value={filter}
          onChange={handleFilterChange}
          options={[
            'All',
            'Reported',
            ...(Object.keys(TagType) as TagFilter[]),
          ]}
          disabled={isLoading}
          label="Filter:"
          getOptionLabel={getTagFilterLabel}
          getOptionValue={getTagFilterValue}
        />
      </section>

      <div className="flex flex-row justify-center">
        <PaginationControls
          currentPage={page}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          totalRecords={total}
          isLoading={isLoading}
        />
      </div>

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
                  <TagList
                    tags={tags}
                    onClearReports={handleClearReports}
                    onDelete={handleDelete}
                    onSelected={handleTagClick}
                  />
                )}
                {activeTabId === 'logs' && (
                  <div>
                    <LogViewer keyName="tag-logs" />
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

export default TagsManager;

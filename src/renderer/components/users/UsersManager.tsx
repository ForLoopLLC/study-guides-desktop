import React, { useState, useEffect } from 'react';
import {
  useGetUsers,
  usePublishUsersIndex,
  useGetTagWithRelations,
} from '../../hooks';
import { FaSpinner } from 'react-icons/fa';
import { useAppContext } from '../../contexts/AppContext';
import { UserFilter, User } from '../../../types';
import { UserFilterType } from '../../../enums';
import {
  UserUpdate,
  PaginationControls,
  FilterSelect,
  Tabs,
  LogViewer,
} from '..';
import Search from '../SearchBar';
import UserList from './UserList';

const UserManager: React.FC = () => {
  const [filter, setFilter] = useState<UserFilter>('All');
  const appContext = useAppContext();
  const count = 15;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { users, refetch, total, isLoading, error } = useGetUsers(
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
  } = usePublishUsersIndex(filter, query, appContext.environment);

  const { tag: tagWithRelations, fetchTag, reset } = useGetTagWithRelations();

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const totalPages = Math.ceil(total / count);

  const handleFilterChange = (filter: UserFilter) => {
    setSelectedUser(null);
    reset();
    setFilter(filter);
    setPage(1);
  };

  const handleTagClick = (tag: any) => {
    setSelectedUser(tag);
  };

  const handleUserUpdate = () => {
    refetch();
  };

  const handleUpdateIndexes = async () => {
    await publishIndex();
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    setSelectedUser(null);
  };

  const getUserFilterLabel = (option: UserFilter) => option;
  const getUserFilterValue = (option: UserFilter) => option;

  useEffect(() => {
    if (selectedUser) {
      fetchTag(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    setPage(1);
    setSelectedUser(null);
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
          disabled={users.length === 0 || isLoading || publishProcessing}
          className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
        >
          {publishProcessing ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : null}
          Update Indexes
        </button>
      </section>

      <section id="messagebar" className="mt-4 p-4 border bg-gray-100 rounded">
        {/* progress display */}
        {publishProcessing && (
          <p>Indexing in progress: ({totalPublished} users published)</p>
        )}
        {/* completed display */}
        {publishComplete && (
          <p className="text-green-500">
            Indexing complete! {totalPublished} users published.
          </p>
        )}

        {/* error display */}
        {publishError && <p className="text-red-500">Error: {publishError}</p>}
      </section>

      <section className="mt-4 mb-4 flex flex-row">
        <div className="mr-3">
          <Search
            query={query}
            setQuery={setQuery}
            onUpdate={() => setPage(1)}
            loading={isLoading}
          />
        </div>
        <FilterSelect
          value={filter}
          onChange={handleFilterChange}
          options={[...(Object.keys(UserFilterType) as UserFilter[])]}
          disabled={isLoading}
          label="Filter:"
          getOptionLabel={getUserFilterLabel}
          getOptionValue={getUserFilterValue}
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
                  <UserList users={users} onSelected={handleTagClick} />
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
          <UserUpdate
            user={selectedUser || undefined}
            onUpdate={handleUserUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManager;

import React, { useState, useEffect } from 'react';
import {
  useGetUsers,
  usePublishUsersIndex,
  useGetTagWithRelations,
} from '../../hooks';
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
import Toolbar from './Toolbar';
import MessageBar from '../MessageBar';

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
      <Toolbar
        disabled={users.length === 0}
        isProcessing={isLoading || publishProcessing}
        handleUpdateIndexes={handleUpdateIndexes}
      />

      <MessageBar
        totalPublished={totalPublished}
        totalAssisted={0}
        publishProcessing={publishProcessing}
        assistProcessing={false}
        publishComplete={publishComplete}
        assistComplete={false}
        publishError={publishError || ''}
        assistError={''}
        entityType="tags"
      />

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

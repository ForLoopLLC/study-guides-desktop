import React, { useState, useEffect } from 'react';
import {
  useGetQuestion,
  useGetQuestions,
  usePublishQuestionsIndex,
  useClearQuestionReports,
  useQuestionBatchAI,
} from '../../hooks';
import { FaSpinner } from 'react-icons/fa';
import { useAppContext } from '../../contexts/AppContext';
import { QuestionFilter, Question } from '../../../types';
import {
  QuestionUpdate,
  PaginationControls,
  FilterSelect,
  Tabs,
  LogViewer,
} from '..';
import Search from '../SearchBar';
import QuestionList from './QuestionList';
import { QuestionFilterType } from '../../../enums';
const QuestionsManager: React.FC = () => {
  const [filter, setFilter] = useState<QuestionFilter>('All');
  const appContext = useAppContext();
  const count = 15;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const { clearReports, isLoading: clearingLoading } =
    useClearQuestionReports();

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const { questions, refetch, total, isLoading, error } = useGetQuestions(
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
  } = usePublishQuestionsIndex(filter, query, appContext.environment);

  const {
    batchAiAssist,
    isLoading: assistProcessing,
    progress: assistProgress,
    totalProcessed: totalAssisted,
    isComplete: assistComplete,
    error: assistError,
  } = useQuestionBatchAI(filter, query, appContext.environment);

  const { question, fetchQuestion, reset } = useGetQuestion();

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const totalPages = Math.ceil(total / count);

  const handleAiAssist = async () => {
    await batchAiAssist();
    await refetch();
  };

  const handleFilterChange = (filter: QuestionFilter) => {
    setSelectedQuestion(null);
    setFilter(filter);
    setPage(1);
  };

  const handleTagClick = (question: any) => {
    setSelectedQuestion(question);
  };

  const handleQuestionUpdated = () => {
    refetch();
  };

  const handleUpdateIndexes = async () => {
    await publishIndex();
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    setSelectedQuestion(null);
  };

  const handleClearReports = async (question: Question) => {
    if (
      window.confirm(
        `Are you sure you want to clear reports for ${question.questionText}?`,
      )
    ) {
      try {
        await clearReports(question.id);
        await refetch();
        window.alert('Reports cleared successfully');
      } catch (error) {
        window.alert('Error clearing reports');
      }
    }
  };

  const getQuestionFilterLabel = (option: QuestionFilter) => option;
  const getQuestionFilterValue = (option: QuestionFilter) => option;

  useEffect(() => {
    if (selectedQuestion) {
      fetchQuestion(selectedQuestion.id);
    }
  }, [selectedQuestion]);

  useEffect(() => {
    setPage(1);
    setSelectedQuestion(null);
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
          disabled={
            questions.length === 0 ||
            isLoading ||
            publishProcessing ||
            assistProcessing
          }
          className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
        >
          {publishProcessing ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : null}
          Update Indexes
        </button>
        <button
          onClick={handleAiAssist}
          disabled={
            questions.length === 0 ||
            isLoading ||
            publishProcessing ||
            assistProcessing
          }
          className="p-2 bg-blue-500 text-white rounded flex items-center justify-center disabled:opacity-50"
        >
          {assistProcessing ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : null}
          Assist
        </button>
      </section>

      <section id="messagebar" className="mt-4 p-4 border bg-gray-100 rounded">
        {/* progress display */}
        {publishProcessing && (
          <p>Indexing in progress: ({totalPublished} questions published)</p>
        )}
        {assistProcessing && (
          <p>Assisting in progress: ({totalAssisted} questions assisted)</p>
        )}
        {/* completed display */}
        {publishComplete && (
          <p className="text-green-500">
            Indexing complete! {totalPublished} questions published.
          </p>
        )}

        {assistComplete && (
          <p className="text-green-500">
            Assist complete! {totalAssisted} questions assisted.
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
            loading={isLoading}
          />
        </div>
        <FilterSelect
          value={filter}
          onChange={handleFilterChange}
          options={[...(Object.keys(QuestionFilterType) as QuestionFilter[])]}
          disabled={isLoading}
          label="Filter:"
          getOptionLabel={getQuestionFilterLabel}
          getOptionValue={getQuestionFilterValue}
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
                  <QuestionList
                    question={questions}
                    onClearReports={handleClearReports}
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
          <Tabs tabs={[{ id: 'edit', label: 'Edit' }]}>
            {(activeTabId) => (
              <>
                {activeTabId === 'edit' && (
                  <QuestionUpdate
                    question={selectedQuestion || undefined}
                    onUpdate={handleQuestionUpdated}
                    isLoading={isLoading}
                    publishProcessing={publishProcessing}
                    assistProcessing={assistProcessing}
                  />
                )}
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default QuestionsManager;

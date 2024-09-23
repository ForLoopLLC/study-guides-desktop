import React, { useReducer, useEffect } from 'react';
import {
  useUpdateTag,
  useLocalStatus,
  useDeleteTag,
  useTagAI,
} from '../../hooks';
import { Tag } from '../../../types';
import SelectTagType from './SelectTagType';
import SelectContentRating from './SelectContentRating';
import clsx from 'clsx';
import { FaClipboard } from 'react-icons/fa'; // Import a clipboard icon from react-icons
import TagTypeCircle from './TagTypeCircle';
import tagReducer from './tagReducer';

interface TagUpdateProps {
  tag?: Tag; // Make tag optional to handle no tag case
  onUpdate: () => void; // Callback function to trigger after update
}

const TagUpdate: React.FC<TagUpdateProps> = ({ tag, onUpdate }) => {
  const {
    updateTag,
    isLoading: isUpdating,
    success: updateSuccess,
    error: updateError,
    resetStatus: resetUpdateStatus,
  } = useUpdateTag();
  const {
    deleteTag,
    isLoading: isDeleting,
    success: deleteSuccess,
    error: deleteError,
    resetStatus: resetDeleteStatus,
  } = useDeleteTag();
  const [state, dispatch] = useReducer(tagReducer, tag || ({} as Tag));

  const { localSuccess, localError, resetStatus } = useLocalStatus(
    updateSuccess,
    updateError,
    deleteSuccess,
    deleteError,
  );

  const { getTagInput, isLoading: aiLoading } = useTagAI();

  const resetAllStatus = () => {
    resetUpdateStatus();
    resetDeleteStatus();
    resetStatus();
  };

  useEffect(() => {
    if (tag) {
      dispatch({ type: 'RESET', payload: tag });
      resetAllStatus();
    }
  }, [tag]);

  const hasChanges = () => {
    return (
      state.parentTagId !== tag?.parentTagId ||
      state.name !== tag?.name ||
      state.description !== tag?.description ||
      state.type !== tag?.type ||
      state.contentRating !== tag?.contentRating ||
      JSON.stringify(state.contentDescriptors) !==
        JSON.stringify(tag?.contentDescriptors) ||
      JSON.stringify(state.metaTags) !== JSON.stringify(tag?.metaTags)
    );
  };

  const handleAssist = async () => {
    try {
      if (!tag) return;
      const assist = await getTagInput(tag.id);
      if (assist) {
        dispatch({
          type: 'SET_FIELDS',
          payload: {
            contentRating: assist.contentRating ?? state.contentRating,
            contentDescriptors:
              assist.contentDescriptors ?? state.contentDescriptors,
            metaTags: assist.metaTags ?? state.metaTags,
          },
        });
        window.alert(`AI Assist completed for ${tag.name}`);
      }
    } catch (error) {
      const err = error as Error;
      window.alert(`Assist failed. ${err.message}`);
    }
  };

  const handleUpdate = async () => {
    if (tag) {
      resetAllStatus();
      await updateTag(state);
      onUpdate();
    }
  };

  const handleCancel = () => {
    if (tag) {
      dispatch({ type: 'RESET', payload: tag });
    }
  };

  const handleDelete = async () => {
    if (tag) {
      resetAllStatus();
      await deleteTag(tag.id);
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    dispatch({ type: 'SET_FIELD', field, value: array });
  };

  // Function to copy the tag ID to clipboard
  const copyToClipboard = async () => {
    if (tag) {
      await navigator.clipboard.writeText(tag.id);
      alert('Tag ID copied to clipboard!');
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text');
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;

    // Get the current selection start and end positions
    const { selectionStart, selectionEnd, value } = target;

    // Insert clipboard data at the current cursor position
    const newValue =
      value.substring(0, selectionStart!) +
      clipboardData +
      value.substring(selectionEnd!);

    dispatch({ type: 'SET_FIELD', field, value: newValue });
  };

  if (!tag) {
    return <p className="text-gray-500">Select a tag to edit</p>;
  }

  return (
    <div>
      {/* Display tag ID with copy-to-clipboard icon */}
      <div>
        <div
          key={tag.id}
          className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
        >
          <TagTypeCircle type={tag.type} />
          <span className="text-lg mr-2">{tag.name}</span>
          <button
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-gray-700"
            title="Copy to clipboard"
          >
            <FaClipboard />
          </button>
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1">Parent Tag Id:</label>
        <input
          type="text"
          value={state.parentTagId || ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'parentTagId',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'parentTagId')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Name:</label>
        <input
          type="text"
          value={state.name || ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'name',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'name')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Description:</label>
        <input
          value={state.description || ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'description',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'description')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <SelectTagType
        value={state.type}
        onChange={(value) =>
          dispatch({ type: 'SET_FIELD', field: 'type', value })
        }
      />

      <SelectContentRating
        value={state.contentRating}
        onChange={(value) =>
          dispatch({ type: 'SET_FIELD', field: 'contentRating', value })
        }
      />

      <div>
        <label className="block font-bold mb-1">
          Content Descriptors (comma-separated):
        </label>
        <textarea
          value={(state.contentDescriptors || []).join(', ')}
          onChange={(e) =>
            handleArrayChange('contentDescriptors', e.target.value)
          }
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">
          Meta Tags (comma-separated):
        </label>
        <textarea
          value={(state.metaTags || []).join(', ')}
          onChange={(e) => handleArrayChange('metaTags', e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <section className="mt-2 mb-2 min-h-[24px]">
        {localSuccess && <p className="text-green-500">{localSuccess}</p>}
        {localError && <p className="text-red-500">{localError}</p>}
      </section>

      <div className="flex space-x-4">
        <button
          onClick={handleUpdate}
          disabled={aiLoading || isUpdating || isDeleting}
          className={clsx(
            'p-2 rounded text-white',
            isUpdating ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500',
          )}
        >
          Update
        </button>

        <button
          onClick={handleCancel}
          disabled={!hasChanges() || aiLoading || isUpdating || isDeleting}
          className={clsx(
            'p-2 rounded text-white',
            hasChanges() ? 'bg-orange-500' : 'bg-gray-300 cursor-not-allowed', // Gray when disabled
          )}
        >
          Cancel
        </button>
        <button
          onClick={handleAssist}
          disabled={aiLoading || isUpdating || isDeleting}
          className={clsx(
            'p-2 rounded text-white',
            'bg-yellow-500', // Gray when disabled
          )}
        >
          Assist
        </button>
        <button
          onClick={handleDelete}
          disabled={aiLoading || isUpdating || isDeleting}
          className={clsx(
            'p-2 rounded text-white',
            'bg-red-500', // Gray when disabled
          )}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TagUpdate;

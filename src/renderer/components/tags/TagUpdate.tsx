import React, { useReducer, useEffect } from 'react';
import { useUpdateTag, useLocalStatus } from '../../hooks';
import { Tag } from '../../../types';
import SelectTagType from './SelectTagType';
import SelectContentRating from './SelectContentRating';
import clsx from 'clsx';
import { FaClipboard } from 'react-icons/fa'; // Import a clipboard icon from react-icons
import TagTypeCircle from './TagTypeCircle';
import tagReducer from './tagReducer';

interface TagUpdateProps {
  tag: Tag;
  onUpdate: () => void; // Callback function to trigger after update
}

const TagUpdate: React.FC<TagUpdateProps> = ({ tag, onUpdate }) => {
  const { updateTag, isLoading, success, error } = useUpdateTag();
  const [state, dispatch] = useReducer(tagReducer, tag);
  const { localSuccess, localError, resetStatus } = useLocalStatus(success, error);

  useEffect(() => {
    dispatch({ type: 'RESET', payload: tag });
    resetStatus();
  }, [tag]);

  const hasChanges = () => {
    return (
      state.parentTagId !== tag.parentTagId ||
      state.name !== tag.name ||
      state.description !== tag.description ||
      state.type !== tag.type ||
      state.contentRating !== tag.contentRating ||
      JSON.stringify(state.contentDescriptors) !==
        JSON.stringify(tag.contentDescriptors) ||
      JSON.stringify(state.metaTags) !== JSON.stringify(tag.metaTags)
    );
  };

  const handleUpdate = async () => {
    await updateTag(state);
    onUpdate();
  };

  const handleCancel = () => {
    dispatch({ type: 'RESET', payload: tag });
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split(',').map((item) => item.trim());
    dispatch({ type: 'SET_FIELD', field, value: array });
  };

  // Function to copy the tag ID to clipboard
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(tag.id);
    alert('Tag ID copied to clipboard!');
  };

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
          onPaste={(e) => 
            dispatch({
              type: 'SET_FIELD',
              field: 'parentTagId',
              value: e.clipboardData.getData('text'),
            })
          }
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Name:</label>
        <input
          type="text"
          value={state.name}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'name',
              value: e.target.value,
            })
          }
          onPaste={(e) => 
            dispatch({
              type: 'SET_FIELD',
              field: 'name',
              value: e.clipboardData.getData('text'),
            })
          }
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Description:</label>
        <input
          value={state.description ?? ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'description',
              value: e.target.value,
            })
          }
          onPaste={(e) => 
            dispatch({
              type: 'SET_FIELD',
              field: 'description',
              value: e.clipboardData.getData('text'),
            })
          }
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
          value={state.contentDescriptors.join(', ')}
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
          value={state.metaTags.join(', ')}
          onChange={(e) => handleArrayChange('metaTags', e.target.value)}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleUpdate}
          disabled={isLoading}
          className={clsx(
            'p-2 rounded text-white',
            isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500',
          )}
        >
          Update
        </button>

        <button
          onClick={handleCancel}
          disabled={!hasChanges()}
          className={clsx(
            'p-2 rounded text-white',
            hasChanges() ? 'bg-orange-500' : 'bg-gray-300 cursor-not-allowed', // Gray when disabled
          )}
        >
          Cancel
        </button>
      </div>

      {localSuccess && (
        <p className="text-green-500 mt-4">Tag updated successfully!</p>
      )}
      {localError && <p className="text-red-500 mt-4">{localError}</p>}
    </div>
  );
};

export default TagUpdate;

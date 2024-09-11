import React, { useReducer, useEffect, useState } from 'react';
import { useUpdateTag } from '../../hooks/useUpdateTag';
import { TagType, ContentRatingType } from '@prisma/client';
import { Tag } from '../../../types';
import SelectTagType from './SelectTagType';
import SelectContentRating from './SelectContentRating';
import clsx from 'clsx';

// Define the action types
type ActionType =
  | {
      type: 'SET_FIELD';
      field: string;
      value: string | string[] | TagType | ContentRatingType;
    }
  | { type: 'RESET'; payload: Tag };

// Define the reducer
const tagReducer = (state: Tag, action: ActionType): Tag => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
};

interface TagUpdateProps {
  tag: Tag;
  onUpdate: () => void; // Callback function to trigger after update
}

const TagUpdate: React.FC<TagUpdateProps> = ({ tag, onUpdate }) => {
  const { updateTag, isLoading, success, error } = useUpdateTag();

  // State for success and error messages
  const [localSuccess, setLocalSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Initialize the reducer with the original tag as the initial state
  const [state, dispatch] = useReducer(tagReducer, tag);

  // Reset state when the selected tag changes
  useEffect(() => {
    dispatch({ type: 'RESET', payload: tag });
    // Clear success and error messages when a new tag is selected
    setLocalSuccess(false);
    setLocalError(null);
  }, [tag]);

  // Helper function to check if the current state differs from the original tag
  const hasChanges = () => {
    return (
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
    if (success) {
      setLocalSuccess(true);
      onUpdate();
    } else if (error) {
      setLocalError(error);
    }
  };

  // Cancel function to restore the original tag values
  const handleCancel = () => {
    dispatch({ type: 'RESET', payload: tag });
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split(',').map((item) => item.trim());
    dispatch({ type: 'SET_FIELD', field, value: array });
  };

  return (
    <div>
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

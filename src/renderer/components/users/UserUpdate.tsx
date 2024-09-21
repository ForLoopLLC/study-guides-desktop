import React, { useReducer, useEffect } from 'react';
import { useUpdateUser, useLocalStatus, useAI } from '../../hooks';
import { User } from '../../../types';
import clsx from 'clsx';
import UserCircle from './UserCircle';
import userReducer from './userReducer';

interface TagUpdateProps {
  user?: User; // Make tag optional to handle no tag case
  onUpdate: () => void; // Callback function to trigger after update
}

const TagForm: React.FC<TagUpdateProps> = ({ user, onUpdate }) => {
  const {
    updateUser,
    isLoading: isUpdating,
    success: updateSuccess,
    error: updateError,
    resetStatus: resetUpdateStatus,
  } = useUpdateUser();

  const [state, dispatch] = useReducer(userReducer, user || ({} as User));

  const { localSuccess, localError, resetStatus } = useLocalStatus(
    updateSuccess,
    updateError,
    true,
    null,
  );

  const { getTagInput, isLoading: aiLoading } = useAI();

  const resetAllStatus = () => {
    resetUpdateStatus();
    resetStatus();
  };

  useEffect(() => {
    if (user) {
      dispatch({ type: 'RESET', payload: user });
      resetAllStatus();
    }
  }, [user]);

  const hasChanges = () => {
    return (
      state.gamerTag !== user?.gamerTag
    );
  };

  const handleAssist = async () => {
    try {
      if (!user) return;
      const assist = await getTagInput(user.id);
      if (assist) {
        // dispatch({
        //   type: 'SET_FIELDS',
        //   payload: {
        //     contentRating: assist.contentRating ?? state.contentRating,
        //     contentDescriptors:
        //       assist.contentDescriptors ?? state.contentDescriptors,
        //     metaTags: assist.metaTags ?? state.metaTags,
        //   },
        // });
        window.alert(`AI Assist completed for ${user.email}`);
      }
    } catch (error) {
      const err = error as Error;
      window.alert(`Assist failed. ${err.message}`);
    }
  };

  const handleUpdate = async () => {
    if (user) {
      resetAllStatus();
      await updateUser(state);
      onUpdate();
    }
  };

  const handleCancel = () => {
    if (user) {
      dispatch({ type: 'RESET', payload: user });
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split(',').map((item) => item.trim());
    dispatch({ type: 'SET_FIELD', field, value: array });
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

  if (!user) {
    return <p className="text-gray-500">Select a tag to edit</p>;
  }

  return (
    <div>
      {/* Display tag ID with copy-to-clipboard icon */}
      <div>
        <div
          key={user.id}
          className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
        >
          <UserCircle user={user} />
          <span className="text-lg mr-2">{user.email?.slice(0,1).toUpperCase()}</span>
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1">GamerTag:</label>
        <input
          type="text"
          value={state.gamerTag || ''}
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

      <section className="mt-2 mb-2 min-h-[24px]">
        {localSuccess && <p className="text-green-500">{localSuccess}</p>}
        {localError && <p className="text-red-500">{localError}</p>}
      </section>

      <div className="flex space-x-4">
        <button
          onClick={handleUpdate}
          disabled={aiLoading || isUpdating}
          className={clsx(
            'p-2 rounded text-white',
            isUpdating ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500',
          )}
        >
          Update
        </button>

        <button
          onClick={handleCancel}
          disabled={!hasChanges() || aiLoading || isUpdating}
          className={clsx(
            'p-2 rounded text-white',
            hasChanges() ? 'bg-orange-500' : 'bg-gray-300 cursor-not-allowed', // Gray when disabled
          )}
        >
          Cancel
        </button>
        <button
          onClick={handleAssist}
          disabled={aiLoading || isUpdating}
          className={clsx(
            'p-2 rounded text-white',
            'bg-yellow-500', // Gray when disabled
          )}
        >
          Assist
        </button>
      </div>
    </div>
  );
};

export default TagForm;

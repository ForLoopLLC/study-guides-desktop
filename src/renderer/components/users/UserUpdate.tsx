import React, { useReducer, useEffect } from 'react';
import { useUpdateUser, useLocalStatus } from '../../hooks';
import { User } from '../../../types';
import clsx from 'clsx';
import UserCircle from './UserCircle';
import userReducer from './userReducer';
import { Role } from '@prisma/client';

interface TagUpdateProps {
  user?: User; // Make tag optional to handle no tag case
  onUpdate: () => void; // Callback function to trigger after update
}

const roleOptions: Role[] = [
  { id: "9e628d8f-26dd-4682-ac52-61104ccadfa1", name: "user" },
  { id: "6c6e1ab5-268e-45bf-8e34-21eef1ed260f", name: "admin" },
  { id: "4b811d73-930f-49f9-acfc-8e4264c869bc", name: "freelancer" },
  { id: "d8cdcb45-469f-4913-853c-8f89514819db", name: "tester" },
];


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
    false,
    null,
  );

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

  const handleRoleChange = (roleId: string) => {
    const existingRole = state.roles.find(role => role.roleId === roleId);
    let updatedRoles;
    
    if (existingRole) {
      // Remove role if it exists
      updatedRoles = state.roles.filter(role => role.roleId !== roleId);
    } else {
      // Add role if it doesn't exist with default values for missing fields
      updatedRoles = [...state.roles, {
        userId: user?.id!,
        roleId,
        role: { id: roleId, name: roleOptions.find(r => r.id === roleId)?.name || '' }, // Add the role field
        createdAt: new Date(), // Provide a default value for createdAt
      }];
    }
  
    dispatch({ type: 'UPDATE_ROLES', payload: updatedRoles });
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
    return <p className="text-gray-500">Select a user to edit</p>;
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
          <span className="text-lg mr-2">{user.name || user.email}</span><span className='text-slate-500'>{user.createdAt.toLocaleDateString()}</span>
        </div>
      </div>

      <div>
        <label className="block font-bold mb-1">Id:</label>
        <input
          type="text"
          value={state.id || ''}
          disabled
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'id',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'id')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Email:</label>
        <input
          type="text"
          value={state.email || ''}
          disabled
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'email',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'email')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">GamerTag:</label>
        <input
          type="text"
          value={state.gamerTag || ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'gamerTag',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'gamerTag')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Stripe:</label>
        <input
          type="text"
          disabled
          value={state.stripeCustomerId || ''}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'stripeCustomerId',
              value: e.target.value,
            })
          }
          onPaste={(e) => handlePaste(e, 'stripeCustomerId')}
          className="p-2 border rounded mb-4 w-full"
        />
      </div>

      <div>
        <label className="block font-bold mb-1">Roles:</label>
        {roleOptions.map((role) => (
          <div key={role.id} className="flex items-center">
            <input
              type="checkbox"
              checked={!!state.roles?.find(r => r.roleId === role.id)}
              onChange={() => handleRoleChange(role.id)}
              className="mr-2"
            />
            <label>{role.name}</label>
          </div>
        ))}
      </div>


      <section className="mt-2 mb-2 min-h-[24px]">
        {localSuccess && <p className="text-green-500">{localSuccess}</p>}
        {localError && <p className="text-red-500">{localError}</p>}
      </section>

      <div className="flex space-x-4">
        <button
          onClick={handleUpdate}
          disabled={ isUpdating}
          className={clsx(
            'p-2 rounded text-white',
            isUpdating ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500',
          )}
        >
          Update
        </button>

        <button
          onClick={handleCancel}
          disabled={!hasChanges() || isUpdating}
          className={clsx(
            'p-2 rounded text-white',
            hasChanges() ? 'bg-orange-500' : 'bg-gray-300 cursor-not-allowed', // Gray when disabled
          )}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TagForm;

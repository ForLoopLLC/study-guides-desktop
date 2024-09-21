import React from 'react';
import { User } from '../../../types';
import UserCircle from './UserCircle';

interface TagListProps {
  users: User[]; // Adjust the type as needed for your tag object
  onSelected: (user: User) => void;
}

const TagsList: React.FC<TagListProps> = ({
  users,
  onSelected,
}) => {
  return (
    <ul id="users">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded border-b"
        >
          <div
            onClick={() => onSelected(user)}
            className="flex items-center w-full"
          >
            <UserCircle user={user} />
            <span className="text-lg ml-2">{user.email}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TagsList;

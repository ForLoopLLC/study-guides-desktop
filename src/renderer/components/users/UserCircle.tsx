import React from 'react';
import { User } from '@prisma/client';

interface UserCircleProps {
  user: User;
}

const UserCircle: React.FC<UserCircleProps> = ({ user }) => {
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full text-white mr-3 bg-slate-600`}
    >
      {user.gamerTag?.slice(0, 1).toUpperCase()}
    </div>
  );
};

export default UserCircle;

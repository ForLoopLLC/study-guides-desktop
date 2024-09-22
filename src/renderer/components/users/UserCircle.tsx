import React from 'react';
import { User } from '@prisma/client';
import { useDeterministicColor } from '../../hooks';
import clsx from 'clsx';

interface UserCircleProps {
  user: User;
}

const UserCircle: React.FC<UserCircleProps> = ({ user }) => {
  const {getColor} = useDeterministicColor();
  const color = getColor(user.email || user.gamerTag || '');

  const style = clsx(
    "w-8 h-8 flex items-center justify-center rounded-full text-white mr-3"
  );

  return (
    <div
      className={style}
      style={{ backgroundColor: color }}
    >
      {user.email?.slice(0, 1).toUpperCase()}
    </div>
  );
};

export default UserCircle;

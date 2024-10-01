import React from 'react';
import { User } from '@prisma/client';
import Circle from '../Circle'; // Import the reusable Circle component
import { useDeterministicColor } from '../../hooks';

interface UserCircleProps {
  user: User;
}

const UserCircle: React.FC<UserCircleProps> = ({ user }) => {
  const { getColor } = useDeterministicColor();
  const label = user.email?.slice(0, 1) || user.gamerTag?.slice(0, 1) || ''; // First letter of email or gamerTag
  const color = getColor(user.email || user.gamerTag || ''); // Generate color based on email or gamerTag

  return <Circle label={label} backgroundColor={color} />;
};

export default UserCircle;

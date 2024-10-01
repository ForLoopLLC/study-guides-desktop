import React from 'react';
import { TagType } from '@prisma/client';
import Circle from '../Circle'; // Import the reusable Circle component

const tagTypeColors: Record<TagType, string> = {
  [TagType.Category]: '#3b82f6', // blue-500
  [TagType.SubCategory]: '#10b981', // green-500
  [TagType.University]: '#ef4444', // red-500
  [TagType.Region]: '#f59e0b', // yellow-500
  [TagType.Department]: '#a855f7', // purple-500
  [TagType.Course]: '#14b8a6', // teal-500
  [TagType.Topic]: '#ec4899', // pink-500
  [TagType.UserFolder]: '#f97316', // orange-500
  [TagType.Organization]: '#6366f1', // indigo-500
  [TagType.Certification]: '#06b6d4', // cyan-500
  [TagType.Module]: '#f43f5e', // rose-500
};

interface TagTypeCircleProps {
  type: TagType;
}

const TagTypeCircle: React.FC<TagTypeCircleProps> = ({ type }) => {
  const color = tagTypeColors[type];
  const label = TagType[type][0]; // Get the first letter of the tag type

  return <Circle label={label} backgroundColor={color} />;
};

export default TagTypeCircle;

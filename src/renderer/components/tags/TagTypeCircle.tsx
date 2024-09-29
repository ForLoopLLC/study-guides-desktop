import React from 'react';
import { TagType } from '@prisma/client';

const tagTypeColors: Record<TagType, string> = {
  [TagType.Category]: 'bg-blue-500',
  [TagType.SubCategory]: 'bg-green-500',
  [TagType.University]: 'bg-red-500',
  [TagType.Region]: 'bg-yellow-500',
  [TagType.Department]: 'bg-purple-500',
  [TagType.Course]: 'bg-teal-500',
  [TagType.Topic]: 'bg-pink-500',
  [TagType.UserFolder]: 'bg-orange-500',
  [TagType.Organization]: 'bg-indigo-500',
  [TagType.Certification]: 'bg-cyan-500',
  [TagType.Module]: 'bg-rose-500',
};

// Helper function to get the first letter of the tag type
const getTagTypeLetter = (type: TagType) => TagType[type][0];

interface TagTypeCircleProps {
  type: TagType;
}

const TagTypeCircle: React.FC<TagTypeCircleProps> = ({ type }) => {
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full text-white mr-3 ${tagTypeColors[type]}`}
    >
      {getTagTypeLetter(type)}
    </div>
  );
};

export default TagTypeCircle;

import React from 'react';
import { Tag } from '../../../types';
import TagTypeCircle from './TagTypeCircle';
import TagListMoreButton from './TagListMoreButton';

interface TagListProps {
  tags: Tag[]; // Adjust the type as needed for your tag object
  onDelete: (tag: Tag) => void;
  onClearReports: (tag: Tag) => void;
  onSelected: (tag: Tag) => void;
}

const TagsList: React.FC<TagListProps> = ({
  tags,
  onSelected,
  onClearReports,
  onDelete,
}) => {
  return (
    <ul id="tags">
      {tags.map((tag) => (
        <li
          key={tag.id}
          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded border-b"
        >
          <div
            onClick={() => onSelected(tag)}
            className="flex items-center w-full"
          >
            <TagTypeCircle type={tag.type} />
            <span className="text-lg ml-2">{tag.name}</span>
          </div>
          <TagListMoreButton
            tag={tag}
            handleDelete={onDelete}
            handleClearReports={onClearReports}
          />
        </li>
      ))}
    </ul>
  );
};

export default TagsList;

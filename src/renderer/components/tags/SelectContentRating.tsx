import React from 'react';
import { ContentRatingType } from '@prisma/client';

interface SelectContentRatingProps {
  value: ContentRatingType;
  onChange: (value: ContentRatingType) => void;
}

const SelectContentRating: React.FC<SelectContentRatingProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block font-bold mb-1">Content Rating:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ContentRatingType)}
        className="p-2 border rounded mb-4 w-full"
      >
        {Object.keys(ContentRatingType).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectContentRating;

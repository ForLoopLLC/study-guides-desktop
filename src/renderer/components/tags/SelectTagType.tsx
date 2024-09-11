import React from 'react';
import { TagType } from '@prisma/client';

interface SelectTagTypeProps {
  value: TagType;
  onChange: (value: TagType) => void;
}

const SelectTagType: React.FC<SelectTagTypeProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block font-bold mb-1">Type:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TagType)}
        className="p-2 border rounded mb-4 w-full"
      >
        {Object.keys(TagType).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectTagType;

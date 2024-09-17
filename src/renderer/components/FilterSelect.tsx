// FilterSelect.tsx
import React from 'react';

interface FilterSelectProps<T> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  disabled?: boolean;
  label?: string;
  getOptionLabel: (option: T) => string; // Function to get the string label from an option
  getOptionValue: (option: T) => T; // Function to get the value from an option
}

const FilterSelect = <T extends string | number | object>({
  value,
  options,
  onChange,
  disabled = false,
  label = '',
  getOptionLabel,
  getOptionValue
}: FilterSelectProps<T>) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const selectedOption = options.find(option => getOptionLabel(option) === newValue);
    if (selectedOption) {
      onChange(getOptionValue(selectedOption));
    }
  };

  return (
    <div className="flex-grow">
      {label && <label className="mr-2 font-bold">{label}</label>}
      <select
        value={getOptionLabel(value)}
        onChange={handleChange}
        disabled={disabled}
        className="p-2 border rounded"
      >
        {options.map((option) => (
          <option key={getOptionLabel(option)} value={getOptionLabel(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;

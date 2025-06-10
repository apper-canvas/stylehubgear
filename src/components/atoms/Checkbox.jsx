import React from 'react';

const Checkbox = ({ id, checked, onChange, className = '', ...props }) => {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent ${className}`}
      {...props}
    />
  );
};

export default Checkbox;
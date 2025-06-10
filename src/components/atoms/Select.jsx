import React from 'react';

const Select = ({ children, value, onChange, className = '', ...props }) => {
  return (
    <select value={value} onChange={onChange} className={`px-4 py-2 border border-gray-300 rounded-lg ${className}`} {...props}>
      {children}
    </select>
  );
};

export default Select;
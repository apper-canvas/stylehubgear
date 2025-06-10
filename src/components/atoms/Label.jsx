import React from 'react';

const Label = ({ children, className = '', htmlFor, ...props }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-2 ${className}`} {...props}>
      {children}
    </label>
  );
};

export default Label;
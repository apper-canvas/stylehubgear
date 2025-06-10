import React from 'react';

const Paragraph = ({ children, className = '', ...props }) => {
  return (
    <p className={className} {...props}>
      {children}
    </p>
  );
};

export default Paragraph;
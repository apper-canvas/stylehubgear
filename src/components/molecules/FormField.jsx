import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';

const FormField = ({ id, label, type = 'text', value, onChange, required, className = '', ...props }) => {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label} {required && '*'}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} required={required} {...props} />
    </div>
  );
};

export default FormField;
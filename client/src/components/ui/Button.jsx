import React from 'react';

export const Button = ({ children, variant, className, ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-md focus:outline-none';
  const variantStyle = variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white';

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};
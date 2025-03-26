import { InputHTMLAttributes } from 'react';

export const Input = ({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-azul focus:border-transparent ${className}`}
      {...props}
    />
  );
};

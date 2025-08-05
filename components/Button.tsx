import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
  const baseStyle = "w-full inline-flex items-center justify-center rounded-md border px-6 py-3 text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-brand-accent",
    secondary: "border-transparent bg-gray-800 text-white hover:bg-black focus:ring-gray-500",
    danger: "border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
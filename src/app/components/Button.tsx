'use client';
import React from 'react';
interface ButtonProps {
    onClick?: () => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
    tooltip?: string;
}


const Button: React.FC<ButtonProps> = ({ onClick = () => { }, label = "", disabled = false, className = '', children = null, tooltip = "" }) => {
    return (
        <button onClick={onClick} title={tooltip} disabled={disabled} className={`
            relative cursor-pointer  px-4 py-1 
            bg-blue-600 text-white rounded-full transition-all overflow-hidden group
            ${className}
        `}>
            <div className='absolute left-0 top-0 w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-700/20 group-hover:bg-black/20 transition-all'></div>
            <span className='relative'>
                {children ? children : label}
            </span>
        </button>
    );
};

export default Button;
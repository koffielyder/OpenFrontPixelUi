'use client';
import React from 'react';
interface ButtonProps {
    onClick?: () => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
    tooltip?: string;
    round?: boolean;
}


const Button: React.FC<ButtonProps> = ({ onClick = () => { }, label = "", disabled = false, className = '', children = null, tooltip = "", round = false }) => {
    return (
        <button onClick={onClick} title={tooltip} disabled={disabled} className={`
            relative cursor-pointer  px-4 py-1 
            bg-blue-600 text-white transition-all group
            drop-shadow-lg
            ${className}
            ${round ? 'rounded-full' : 'rounded-md'}
        `}>
            <div className={`absolute left-0 top-0 w-full h-full bg-gradient-to-tl from-gray-700/50 to-gray-700/10 group-hover:bg-black/10 transition-all ${round ? 'rounded-full' : 'rounded-md'}`}></div>
            <span className='relative'>
                {children ? children : label}
            </span>
        </button>
    );
};

export default Button;
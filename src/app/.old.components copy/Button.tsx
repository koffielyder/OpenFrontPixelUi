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


const Button: React.FC<ButtonProps> = ({ onClick = () => {}, label = "", disabled = false, className = '', children = null, tooltip = "" }) => {
    return (
        <button onClick={onClick} title={tooltip} disabled={disabled} className={`
            relative cursor-pointer border-black/20 border-r-4 border-b-4 px-3 py-1 
            bg-blue-600 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white font-mono 
            active:translate-y-1 active:translate-x-1 active:shadow-none transition-all
            ${className}
        `}>
            {children ? children : label}
        </button>
    );
};

export default Button;
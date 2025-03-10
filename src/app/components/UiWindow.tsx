import React, { useState } from 'react';
import Button from './Button';

interface UiWindowProps {
    title: string;
    subTitle?: string;
    children: React.ReactNode;
    className?: string;
    childClass?: string;
    hidable?: boolean;
    closable?: boolean;
    background?: boolean;
    isOpen?: boolean;
    startVisible?: boolean;
    onClose?: () => void;
}

const UiWindow: React.FC<UiWindowProps> = ({ title, subTitle, children, className, childClass = "", hidable = true, closable = false, startVisible = true, onClose, isOpen = true }) => {
    const [isVisible, setIsVisible] = useState(startVisible);

    const toggleVisible = () => {
        setIsVisible(!isVisible);
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className={`flex flex-col ${className} theme-container overflow-hidden ${!isOpen ? 'hidden ' : ''}`}>
            <div className={`flex gap-4 text-xl font-bold text-white bg-gradient-to-br from-green-600/60 to-black/30`}>
                {hidable ? (
                    <label className="cursor-pointer flex gap-4 w-full p-4 items-center">
                        <div>
                            <span>{title}</span>

                            {subTitle && (
                                <div className="text-gray-400 text-sm">
                                    {subTitle}
                                </div>
                            )}
                        </div>
                        <input type="checkbox" id="toggle-rankings" className="opacity-0" onChange={toggleVisible} checked={isVisible} />
                    </label>
                ) : (
                    <label className="flex justify-between w-full p-4">{title}</label>
                )}
                {closable && (
                    <div className='p-2'>
                        <Button onClick={handleClose} className="p-2 text-white bg-red-600 relative">
                            x
                        </Button>
                    </div>
                )}
            </div>

            {isVisible && (
                <div className={`${childClass}`}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default UiWindow;
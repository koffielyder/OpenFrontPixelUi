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

const UiWindow: React.FC<UiWindowProps> = ({ title, subTitle, children, className, childClass = "", hidable = true, closable = false, background = true, startVisible = true, onClose, isOpen = true }) => {
    const [isVisible, setIsVisible] = useState(startVisible);
    const [isClosed, setIsClosed] = useState(false);

    const toggleVisible = () => {
        setIsVisible(!isVisible);
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setIsClosed(true);
    };

    return (
        <div className={`flex flex-col ${className} ${background ? 'bg-gray-800 pixel-shadow ' : ''} ${!isOpen ? 'hidden ' : ''}`}>
            <div className={`flex gap-4 font-mono text-xl bg-gray-800 font-bold text-white  ${!background && 'pixel-shadow'}`}>
                {hidable ? (
                    <label className="cursor-pointer flex gap-4 w-full p-4 items-center">
                        <input type="checkbox" id="toggle-rankings" className="pixel-checkbox" onChange={toggleVisible} checked={isVisible} />
                        <div>
                            <span>{title}</span>

                            {subTitle && (
                                <div className="text-gray-400 text-sm">
                                    {subTitle}
                                </div>
                            )}
                        </div>
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
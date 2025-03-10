import React, { useEffect, useRef, useState } from 'react';

interface DialogProps {
    isOpen?: boolean;
    isCollapsed?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    onCollapse?: (isCollapsed: boolean) => void;
    label?: string;
    hideLabel?: string;
    children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen = false, isCollapsed = false, onCollapse, children, label = "Open", hideLabel = "Hide" }) => {
    const [collapsed, setCollapsed] = useState(isCollapsed);

    const [maxHeight, setMaxHeight] = useState('0px');
    const [maxWidth, setMaxWidth] = useState('0px');
    const [minWidth, setMinWidth] = useState('0px');

    const contentRef = useRef<HTMLDivElement>(null);
    const titleHiddenRef = useRef<HTMLDivElement>(null);
    const titleVisibleRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // const handleOpen = () => {
    //     setOpen(true);
    //     if (onOpen) {
    //         onOpen();
    //     }
    // };

    // const handleClose = () => {
    //     setOpen(false);
    //     if (onClose) {
    //         onClose();
    //     }
    // };

    const handleCollapse = () => {
        setCollapsed(!collapsed);
        if (onCollapse) {
            onCollapse(collapsed);
        }
    };


    useEffect(() => {
        if (contentRef.current) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        }
    }, [children]);

    useEffect(() => {
        if (containerRef.current) {
            setMaxWidth(`${containerRef.current.scrollWidth}px`);
        }
        if (titleHiddenRef.current) {
            setMinWidth(`${titleHiddenRef.current.scrollWidth}px`);
        }
    }, []); // Empty dependency array to run only once


    return (
        <div className={`w-full h-max`} ref={containerRef}>
            <div className='theme-container relative overflow-hidden w-full flex flex-col transition-all duration-300'
                style={{
                    maxWidth: !collapsed ? maxWidth : minWidth,
                }}
            >
                <button
                    className={`bg-black/30 text-left w-full relative h-10 overflow-hidden`}
                    onClick={handleCollapse}
                >
                    <div className={`w-max px-4 py-2 top-0 left-0 absolute ${!collapsed && 'opacity-0'}`} ref={titleHiddenRef}>{label}</div>
                    <div className={`w-max px-4 py-2 top-0 left-0 absolute ${collapsed && 'opacity-0'}`} ref={titleVisibleRef}>{hideLabel}</div>
                </button>

                <div
                    className={`transition-all duration-300 ease-out overflow-hidden`}
                    style={{ maxHeight: !collapsed ? maxHeight : '0px' }}
                    ref={contentRef}
                >
                    <div className="p-4"
                        style={{ minWidth: maxWidth, minHeight: maxHeight }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
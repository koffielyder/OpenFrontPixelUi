import React, { useEffect, useRef, useState } from 'react';

interface DialogProps {
    className?: string;
    children: React.ReactNode;
    openLabel?: string;
    closeLabel?: string;
    startCollapsed?: boolean;
}

const Dialog: React.FC<DialogProps> = ({ className, children, openLabel = 'show', closeLabel = 'hide', startCollapsed = true }) => {
    const initStyle: React.CSSProperties = {
        opacity: 0,
        pointerEvents: 'none'
    };

    const dialogRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [originalMaxHeight, setOriginalMaxHeight] = useState<string>();
    const [originalMaxWidth, setOriginalMaxWidth] = useState<string>();
    const [isResizing, setIsResizing] = useState(false);

    const toggleAnimationClasses: React.CSSProperties = {
        transition: 'all 0.3s ease-in-out'
    };

    let resizeTimeout: NodeJS.Timeout;

    const resetStyles = (onAnimationFrame: FrameRequestCallback | null | boolean = null) => {
        if (dialogRef.current) {
            const resetStyle: React.CSSProperties = {
                opacity: 0,
                pointerEvents: 'all',
                maxWidth: '',
                maxHeight: '',
                transition: 'none'
            };

            Object.assign(dialogRef.current.style, resetStyle);
            if (onAnimationFrame) {
                let callback: FrameRequestCallback = () => { };
                if (typeof onAnimationFrame === 'function') {
                    callback = onAnimationFrame;
                }
                requestAnimationFrame(callback);
            }
        }
    }

    const updateDimensions = () => {
        if (dialogRef.current) {

            resetStyles(() => {
                const { offsetWidth, offsetHeight } = dialogRef.current!;
                console.log(`Width: ${offsetWidth}, Height: ${offsetHeight}`);
                const resetStyle: React.CSSProperties = {
                    pointerEvents: 'all',
                    maxWidth: `${offsetWidth}px`,
                    maxHeight: `${offsetHeight}px`,
                    transition: 'none'
                };
                if (dialogRef.current) {
                    Object.assign(dialogRef.current.style, resetStyle);
                    setOriginalMaxHeight(`${offsetHeight}px`);
                    setOriginalMaxWidth(`${offsetWidth}px`);
                }

                // Run the next function after styles are applied
                nextFunction();
                requestAnimationFrame(() => {
                    if (dialogRef.current) {
                        Object.assign(dialogRef.current.style, { opacity: 1 });
                        requestAnimationFrame(() => {
                            if (dialogRef.current) {
                                Object.assign(dialogRef.current.style, { transition: toggleAnimationClasses.transition });
                            }
                        });
                    }
                });

            });
            // Wait for the next animation frame to ensure styles are applied
        }
    };

    const nextFunction = () => {
        // Your next function logic here
    };

    const handleResize = () => {
        clearTimeout(resizeTimeout);
        if (isResizing) return;
        setIsResizing(true);
        resetStyles(true);
        resizeTimeout = setTimeout(() => {
            updateDimensions();
            setIsResizing(false);
        }, 100);
    };

    useEffect(() => {
        updateDimensions(); // Get dimensions after rendering
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    useEffect(() => {
        if (startCollapsed) {
            if (dialogRef.current && originalMaxHeight && originalMaxWidth) {
                setIsCollapsed(true);
                if (buttonRef.current) {
                    dialogRef.current.style.maxHeight = `${buttonRef.current.offsetHeight}px`;
                    dialogRef.current.style.maxWidth = `${buttonRef.current.offsetWidth}px`;
                }
            }
        }
    }, [originalMaxHeight, originalMaxWidth, startCollapsed]);

    const toggleCollapse = () => {
        if (dialogRef.current && originalMaxHeight && originalMaxWidth) {
            setIsCollapsed(!isCollapsed);
            if (buttonRef.current) {
                dialogRef.current.style.maxHeight = isCollapsed ? originalMaxHeight : `${buttonRef.current.offsetHeight}px`;
                dialogRef.current.style.maxWidth = isCollapsed ? originalMaxWidth : `${buttonRef.current.offsetWidth}px`;
            }
        }
    };

    return (
        <div className={`max-h-full max-w-full h-full w-full theme-container flex flex-col ${toggleAnimationClasses} ${className}`} style={initStyle} ref={dialogRef}>
            <button className='flex justify-center' onClick={toggleCollapse}>
                <span className='py-2 px-8 w-max flex' ref={buttonRef}>
                    {isCollapsed ? openLabel : closeLabel}
                </span>
            </button>
            <div className="flex flex-col gap-2 flex-grow overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default Dialog;
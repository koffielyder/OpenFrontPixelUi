import React, { useEffect } from 'react';
import { Event } from '../interfaces/interfaces';

interface EventLogProps {
    events: Event[];
    newEvents: Event[];
    className?: string;
    showAll?: boolean;
}

const EventLog: React.FC<EventLogProps> = ({ events = [], newEvents = [], className = '', showAll = false }) => {
    const [isUserScrolling, setIsUserScrolling] = React.useState(false);
    const [shouldShowAll, setShowAll] = React.useState(showAll);
    const eventLogRef = React.useRef<HTMLDivElement>(null);

    const getEventClass = (event: Event) => {
        return `
            ${getEventTypeClass(event.type, event.priority ?? 1)} 
            ${getEventPrioClass(event.priority)}
        `;
    };

    const getEventTypeClass = (type: string, prio: number) => {
        switch (type) {
            case 'info':
                return `${prio === 1 ? 'shadow-blue-900 bg-blue-600/30' : 'shadow-blue-900 bg-blue-600/50'} text-xs py-1`;
            case 'warning':
                return `${prio === 1 ? 'shadow-yellow-900 bg-yellow-600/30' : 'shadow-yellow-900 bg-yellow-600/50'} text-md font-bold py-2`;
            case 'success':
                return `${prio === 1 ? 'shadow-green-900 bg-green-600/30' : 'shadow-green-900 bg-green-600/50'} text-md font-bold py-2`;
            case 'danger':
                return `${prio === 1 ? 'shadow-red-900 bg-red-600/30' : 'shadow-red-900 bg-red-600/50'} text-md font-bold py-2`;
            default:
                return '';
        }
    };

    const getEventPrioClass = (prio: number | undefined) => {
        switch (prio) {
            case 1:
                return 'text-xs py-1';
            case 2:
                return 'text-md font-bold py-2';
            case 3:
                return 'text-md font-bold py-4';
            default:
                return 'text-xs py-1';
        }
    };

    
    const handleScroll = () => {
        if (eventLogRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = eventLogRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setIsUserScrolling(false);
            } else {
                setIsUserScrolling(true);
            }
        }
    };

    const getEvents = () => {
        return (shouldShowAll ? events : newEvents).slice(Math.max(newEvents.length - (!shouldShowAll ? 3 : newEvents.length), 0))
    }

    React.useEffect(() => {
        if (!isUserScrolling && eventLogRef.current) {
            eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
        }
    }, [events, isUserScrolling]);

    useEffect(() => {
        setShowAll(showAll);
    }, [showAll]);


    return (
        <div className={`relative flex flex-col-reverse md:flex-col gap-2 ${className}`}>
            <div
                ref={eventLogRef}
                onScroll={handleScroll}
                className="flex flex-col gap-3 overflow-auto h-full md:px-4 relative w-full"
            >
                {getEvents().map(event => (
                    <p key={"event-log" + event.id} className={`theme-container px-4 ${getEventClass(event)}`}>
                        {event.message}
                    </p>
                ))}
            </div>
            {/* <button className='text-right' onClick={toggleShowAll}>{shouldShowAll ? 'Hide' : 'Show event log'}</button> */}
        </div>
    );
};

export default EventLog;

import React from 'react';

interface Event {
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    priority?: number;
  }

interface EventLogProps {
    events: Event[];
}

const EventLog: React.FC<EventLogProps> = ({ events = [] }) => {
    const [isUserScrolling, setIsUserScrolling] = React.useState(false);
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
                return `${prio === 1 ? 'shadow-blue-900 bg-blue-600/50' : 'shadow-blue-900 bg-blue-600'} text-xs py-1`;
            case 'warning':
                return `${prio === 1 ? 'shadow-yellow-900 bg-yellow-600/50' : 'shadow-yellow-900 bg-yellow-600'} text-md font-bold py-2`;
            case 'success':
                return `${prio === 1 ? 'shadow-green-900 bg-green-600/50' : 'shadow-green-900 bg-green-600'} text-md font-bold py-2`;
            case 'danger':
                return `${prio === 1 ? 'shadow-red-900 bg-red-600/50' : 'shadow-red-900 bg-red-600'} text-md font-bold py-2`;
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

    React.useEffect(() => {
        if (!isUserScrolling && eventLogRef.current) {
            eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
        }
    }, [events, isUserScrolling]);

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

    return (
        <div className='relative flex h-full'>

            <div
                ref={eventLogRef}
                onScroll={handleScroll}
                className="flex flex-col gap-3 overflow-auto h-full pixel-scrollbar px-4 py-2 relative"
            >
                {events.map((event, index) => (
                    <p key={index} className={`font-mono pixel-shadow px-4 ${getEventClass(event)}`}>
                        {event.message}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default EventLog;
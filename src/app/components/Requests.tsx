import React, { useState, useEffect } from 'react';
import UiWindow from './UiWindow';
import Button from './Button';

interface Request {
    title: string;
    subTitle: string;
    message: string;
}

interface RequestsProps {
    requests: Request[];
    onRequestsChange: (newRequests: Request[]) => void;
    className?: string;
}

const Requests: React.FC<RequestsProps> = ({ requests = [], onRequestsChange, className = "" }) => {
    const [currentRequests, setCurrentRequests] = useState(requests);

    useEffect(() => {
        setCurrentRequests(requests);
    }, [requests]);

    const handleRemoveRequest = (index: number) => {
        const newRequests = currentRequests.filter((_, i) => i !== index);
        setCurrentRequests(newRequests);
        onRequestsChange(newRequests);
    };

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            {currentRequests.map((request, index) => (
                <UiWindow
                    key={index}
                    startVisible={currentRequests.length === 1}
                    title={request.title}
                    subTitle={request.subTitle}
                    childClass="max-h-[30vh]"
                    className={`w-full`}
                >
                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <p className="text-white">{request.message}</p>
                        <div className="flex gap-4 w-full justify-between">
                            <Button label="Focus" className="w-3/8" />
                            <Button
                                label="Accept"
                                className="w-3/8 bg-green-500 text-white"
                                onClick={() => handleRemoveRequest(index)}
                            />
                            <Button
                                label="Decline"
                                className="w-3/8 bg-red-500 text-white"
                                onClick={() => handleRemoveRequest(index)}
                            />
                        </div>
                    </div>
                </UiWindow>
            ))}
        </div>
    );
};

export default Requests;
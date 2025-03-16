import React, { useState, useEffect } from 'react';
import UiWindow from './UiWindow';
import Button from './Button';
import { GameRequest } from '../interfaces/interfaces';


interface RequestsProps {
    requests: GameRequest[];
    className?: string;
}

const Requests: React.FC<RequestsProps> = ({ requests = [], className = "" }) => {
    const [currentRequests, setCurrentRequests] = useState(requests);

    useEffect(() => {
        setCurrentRequests(requests);
    }, [requests]);


    return (
        <div className={`flex flex-col gap-4 w-full items-center overflow-auto ${className}`}>
            {currentRequests.map(request => (
                <UiWindow
                    key={"requests" + request.id}
                    startVisible={currentRequests.length === 1}
                    title={request.title}
                    subTitle={request.subTitle}
                    className={`w-full max-w-[600px] h-max`}
                >
                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                        <p className="text-white">{request.message}</p>
                        <div className="flex gap-4 w-full justify-between">
                            <Button label="Focus" className="w-3/8" />
                            <Button
                                label="Accept"
                                className="w-3/8 bg-green-500 text-white"
                                onClick={request.onAccept}
                            />
                            <Button
                                label="Decline"
                                className="w-3/8 bg-red-500 text-white"
                                onClick={request.onReject}
                            />
                        </div>
                    </div>
                </UiWindow>
            ))}
        </div>
    );
};

export default Requests;
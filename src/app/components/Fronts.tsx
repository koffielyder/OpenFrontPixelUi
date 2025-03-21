import React, { useEffect, useState } from 'react';
import { Front, Player } from '../interfaces/interfaces';
import { formatNumber } from '../utils/NumberFormatter';

interface FrontsProps {
    className?: string;
    fronts: Front[];
    onSendTroops?: (front: Front, player: Player | null) => void;
}

const Fronts: React.FC<FrontsProps> = ({ className, fronts, onSendTroops }) => {

    const [updatedFronts, setUpdatedFronts] = useState<Front[]>(fronts);
    const incomingValuesRef = React.useRef<number[]>(fronts.map(front => front.incoming));
    const [pulseIndex, setPulseIndex] = useState<number | null>(null);

    // const getTroopSize = (player: Player) => {
    //     return player.troops * (player.attackRatio / 100);
    // }

    // const addIncoming = (front: Front | null = null) => {
    //     if (!front) front = randomFront();
    //     setUpdatedFronts(prevFronts => prevFronts.map((f) => {
    //         if (f === front) {
    //             return { ...f, incoming: f.incoming + getTroopSize(f.player) };
    //         }
    //         return f;
    //     }));

    // }

    // const addOutgoing = (front: Front | null = null) => {
    //     if (!front) front = randomFront();
    //     setUpdatedFronts(prevFronts => prevFronts.map((f) => {
    //         if (f == front) {
    //             return { ...f, outgoing: f.outgoing + getTroopSize(f.player) };
    //         }
    //         return f;
    //     }));
    // }

    // const randomFront = () => {
    //     const randomIndex = Math.floor(Math.random() * fronts.length);
    //     return fronts[randomIndex];
    // }


    // const addIncoming = (front: Front) => {
    //     if(!gameService.frontService) return;
    //     gameService.frontService.addIncoming(front);
    // }

    // const addOutgoing = (front: Front) => {
    //     if(!gameService.frontService) return;
    //     gameService.outgoingTroops(front);
    // }

    const handleSendTroops = (front: Front, player: Player | null = null) => {
        if (onSendTroops) {
            onSendTroops(front, player);
        }
    }

    useEffect(() => {
        setUpdatedFronts(fronts);
    }, [fronts]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setUpdatedFronts(prevFronts => prevFronts.map(front => ({
    //             ...front,
    //             incoming: Math.max(0, Math.round(front.incoming * 0.95) - Math.round(front.outgoing * 0.05) - 1000),
    //             outgoing: Math.max(0, Math.round(front.outgoing * 0.95) - Math.round(front.incoming * 0.05) - 1000),
    //             idleTime: (front.incoming === 0 && front.outgoing === 0) ? (front.idleTime || 0) + 1 : 0
    //         })).filter(front => front.idleTime < 3));
    //         console.log({updatedFronts})
    //     }, 1000);


    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        updatedFronts.forEach((front, index) => {
            if (front.incoming > incomingValuesRef.current[index]) {
                setPulseIndex(index);
                incomingValuesRef.current = updatedFronts.map(front => front.incoming);
                setTimeout(() => setPulseIndex(null), 1000); // Remove pulse effect after 1 second
            }
        });
        incomingValuesRef.current = updatedFronts.map(front => front.incoming);
    }, [updatedFronts]);

    return (
        <div className={`overflow-auto flex-wrap-reverse 2xl:flex grid grid-cols-2 gap-2 2xl:gap-4 justify-start items-start h-full md:h-max ${className}`}>

            {updatedFronts.map((front, index) => (
                <div
                    key={"fronts" + front.id}
                    className={`front theme-container w-full 2xl:w-[calc(50%-1rem)] 2xl:w-[calc(33.333%-1rem)] max-h-max p-2 px-4 2xl:p-4 flex flex-col items-end gap-2 bg-black/50 ${front.outgoing - front.incoming === 0 ? '' : front.outgoing - front.incoming > 0 ? 'from-blue-600/50 to-blue-600/10 bg-gradient-to-bl' : 'from-red-600/50 to-red-600/10  bg-gradient-to-br' }`}
                >
                    <div className={`absolute w-full h-full top-0 left-0 bg-red-600 rounded-lg opacity-0 ${pulseIndex === index ? 'pulse-red' : ''}`}>
                    </div>

                    <div className='z-10 w-full flex md:flex-col items-end gap-2 justify-between items-center text-sm 2xl:text-base'>
                        <h3 className='truncate w-full text-sm 2xl:text-right'>{front.player.name}</h3>
                        <span className="w-full h-[1px] bg-white opacity-30 hidden 2xl:flex"></span>
                        <div className='grid 2xl:grid-cols-3 text-center 2xl:w-full gap-8 relative'>
                            <span className="text-blue-500 hidden 2xl:flex">{formatNumber(front.outgoing)}</span>
                            <span className={`${front.outgoing - front.incoming > 0 ? 'text-green-500' : front.outgoing - front.incoming < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                {formatNumber(front.outgoing - front.incoming)}
                            </span>
                            <span className="text-red-500 hidden 2xl:fle">{formatNumber(front.incoming)}</span>
                        </div>
                    </div>
                    <div className={`absolute w-full h-full top-0 left-0 bg-white rounded-lg opacity-0 flex z-10`}>
                        <button className='w-full h-full cursor-pointer' onClick={() => handleSendTroops(front)} />
                        <button className='w-full h-full cursor-pointer' onClick={() => handleSendTroops(front, front.player)} />
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Fronts;
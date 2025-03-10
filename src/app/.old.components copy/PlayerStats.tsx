import React, { useState, useEffect } from 'react';

const PlayerStats: React.FC = () => {
    const [population, setPopulation] = useState(0);
    const [workers, setWorkers] = useState(0);
    const [troops, setTroops] = useState(0);
    const [attackRatio, setAttackRatio] = useState(50);

    useEffect(() => {
        const randomPopulation = Math.floor(Math.random() * 1000000) + 1000; // Random number between 1000 and 10000
        setPopulation(randomPopulation);
        setWorkers(0); // Example logic to update workers
        setTroops(randomPopulation); // Example logic to update troops
    }, []);

    const handlePopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setWorkers(population - value);
        setTroops(value);
    };

    const handleAttackRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setAttackRatio((value / population) * 100);
    };

    return (
        <div id="player-stats" className="bg-transparent text-white flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4 text-center">
                <div className="pixel-shadow bg-purple-600 p-2 flex flex-col shadow-purple-900 gap-1">
                    <span>Pop</span>
                    <div className="bg-purple-400 shadow-purple-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
                    <span>{population}</span>
                </div>
                <div className="pixel-shadow bg-yellow-600 p-2 flex flex-col shadow-yellow-900 gap-1">
                    <span>Gold</span>
                    <div className="bg-yellow-400 shadow-yellow-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
                    <span>340K</span>
                </div>
                <div className="pixel-shadow bg-blue-600 p-2 flex flex-col shadow-blue-900 gap-1">
                    <span>Ports</span>
                    <div className="bg-blue-400 shadow-blue-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
                    <span>3</span>
                </div>
                <div className="pixel-shadow bg-green-600 p-2 flex flex-col shadow-green-900 gap-1">
                    <span>Cities</span>
                    <div className="bg-green-400 shadow-green-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
                    <span>5</span>
                </div>
            </div>

            <div className="p-4 border-pixel bg-gray-800 pixel-shadow flex flex-col gap-6 items-center">
                <div className="flex flex-col gap-2 w-full">
                    <div className="items-center space-x-4 flex justify-between">
                        <p className="text-green-200 pixel-number flex gap-2 p-2 align-middle pixel-shadow items-center text-center bg-green-800 shadow-green-950">
                            Workers: {workers.toFixed(0)}
                        </p>

                        <p className="text-red-200 pixel-number flex gap-2 p-2 align-middle pixel-shadow items-center text-center bg-red-800 shadow-red-950">
                            Troops: {troops.toFixed(0)}
                        </p>
                    </div>
                    <input type="range" min="0" max={population} value={troops} className="pixel-range" onInput={handlePopChange} />
                </div>

                <div className="bg-gray-800 w-full h-1 pixel-shadow"></div>

                <div className="flex flex-col-reverse gap-4 w-full">
                    <div className="items-center space-x-4 flex justify-between">
                        <p className="text-yellow-300 pixel-number flex gap-2 align-middle items-center text-center">
                            Attack ratio:
                        </p>

                        <p className="text-yellow-300 pixel-number flex gap-2 p-2 align-middle pixel-shadow items-center text-center bg-yellow-800 shadow-yellow-950">
                            {attackRatio.toFixed(0)}%
                        </p>
                    </div>
                    <input type="range" min="0" max={population} value={(attackRatio / 100) * population} className="pixel-range" onInput={handleAttackRatioChange} />
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
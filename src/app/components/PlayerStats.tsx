import React, { useState, useEffect } from 'react';
import { Player } from '../interfaces/interfaces';
import { formatNumber } from '../utils/NumberFormatter';

interface PlayerStatsProps {
    player: Player,
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
    const [attackRatio, setAttackRatio] = useState(player.attackRatio);
    const [troopRatio, setTroopRatio] = useState(100);
    const [currentPlayer, setCurrentPlayer] = useState(player);

    const handlePopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setTroopRatio(value)
    };

    const handleAttackRatioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        player.attackRatio = value;
        setCurrentPlayer(player)
        setAttackRatio(player.attackRatio);
    };

    useEffect(() => {
        setCurrentPlayer(player)
        setAttackRatio(player.attackRatio);
    }, [player])

    return (
        <div id="player-stats" className='flex flex-col md:gap-4 gap-1 w-full md:max-w-sm h-max'>
            <div className="flex gap-2 md:hidden">
                <div className='theme-stat-box-vertical px-4 !from-cyan-900/60 items-center flex justify-between text-sm flex-grow'>
                    <span>Pop:</span>
                    <div className='flex gap-1'>
                        <span className='flex flex-shrink-0 flex-grow-0 font-bold'>{formatNumber(currentPlayer.population)}</span>
                        <span className='text-right'>/ {formatNumber(currentPlayer.maxPopulation)}</span>
                    </div>
                    <span className='text-xs text-green-600 self-start'>+150</span>
                </div>

                <div className='theme-stat-box-vertical px-4 !from-yellow-900/60 items-center flex gap-2 justify-between text-sm flex-grow'>
                    <span>Gold:</span>
                    <div className='flex gap-1'>
                        <span>{formatNumber(currentPlayer.gold)}</span>
                    </div>
                    <span className='text-xs text-green-600 self-start'>+123</span>
                </div>
            </div>
            <div className="gap-1 md:gap-4 w-full grid-cols-4 hidden md:grid">
                <div className='theme-stat-box px-2 md:px-4 !from-cyan-900/60'>
                    <div className='flex flex-col items-center text-center'>
                        <span>Pop</span>
                        <span className='text-xs text-green-600'>+150</span>
                    </div>
                    <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
                    <div className='flex flex-col items-center flex-shrink-0 flex-grow-0'>
                        <span className='flex flex-shrink-0 flex-grow-0'>{formatNumber(currentPlayer.population)}</span>
                        <span className='text-xs text-right'>/ {formatNumber(currentPlayer.maxPopulation)}</span>
                    </div>
                </div>
                <div className='theme-stat-box px-2 md:px-4 !from-yellow-900/60'>
                    <div className='flex flex-col items-center text-center'>
                        <span>Gold</span>
                        <span className='text-xs text-green-600'>+76</span>
                    </div>
                    <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
                    <span>{formatNumber(currentPlayer.gold)}</span>
                </div>
                <div className={`theme-stat-box px-2 md:px-4 !from-blue-900/60 ${!currentPlayer.ports && 'opacity-50'}`}>
                    <span>Ports</span>
                    <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
                    <span>{currentPlayer.ports}</span>
                </div>
                <div className={`theme-stat-box px-2 md:px-4 !from-green-900/60 ${!currentPlayer.cities && 'opacity-50'}`}>
                    <span>Cities</span>
                    <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
                    <span>{currentPlayer.cities}</span>
                </div>
            </div>
            <div className='theme-container '>
                <div className='md:p-4 p-2 px-4 flex flex-col w-full md:gap-2 gap-1 flex-shrink-0 flex-grow-0'>
                    <div className='w-full grid grid-cols-5'>
                        <span className='text-left'>{formatNumber((currentPlayer.population / 100) * (100 - troopRatio))}</span>
                        <span className='text-left'>Workers</span>
                        <span className='text-center opacity-30'>|</span>
                        <span className='text-right'>Troops</span>
                        <span className='text-right'>{formatNumber((currentPlayer.population / 100) * troopRatio)}</span>
                    </div>
                    <input type="range" min="0" max="100" value={troopRatio} className="w-full" onInput={handlePopChange} />
                </div>
            </div>

            <div className='theme-container flex-shrink-0 flex-grow-0'>
                <div className='flex flex-col w-full md:gap-2 gap-1 md:p-4 p-2 px-4'>
                    <div className='w-full flex justify-between'>
                        <div>
                            <span>Attack ratio: </span>
                            <span>({formatNumber((currentPlayer.population / 100) * attackRatio)})</span>
                        </div>
                        <div>
                            <span>{attackRatio}%</span>
                        </div>
                    </div>
                    <input className='w-full' type="range" name="attackRatio" id="attackRatio" onChange={handleAttackRatioChange} value={currentPlayer.attackRatio} />
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
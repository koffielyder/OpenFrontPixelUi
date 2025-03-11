import React, { useState, useEffect } from 'react';
import { Player } from '../interfaces/interfaces';
import { formatNumber } from '../utils/NumberFormatter';

interface PlayerStatsProps {
    player: Player,
    onPlayerChange: (player: Player) => void
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, onPlayerChange }) => {
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
        onPlayerChange(player);
        setCurrentPlayer(player)
        setAttackRatio(player.attackRatio);
    };

    useEffect(() => {
        setCurrentPlayer(player)
        setAttackRatio(player.attackRatio);
    }, [player])

    return (
        <div id="player-stats" className='flex flex-col gap-4 max-w-sm'>
            <div className="gap-4 w-full grid grid-cols-4">
                <div className='theme-stat-box !from-cyan-900/60'>
                    <div className='flex flex-col items-center text-center'>
                        <span>Pop</span>
                        <span className='text-xs text-green-600'>+150</span>
                    </div>
                    <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
                    <div className='flex flex-col items-center'>
                        <span className=''>{formatNumber(currentPlayer.population)}</span>
                        <span className='text-xs text-right'>/ {formatNumber(currentPlayer.maxPopulation)}</span>
                    </div>
                </div>
                <div className='theme-stat-box !from-yellow-900/60'>
                    <div className='flex flex-col items-center text-center'>
                        <span>Gold</span>
                        <span className='text-xs text-green-600'>+76</span>
                    </div>
                    <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
                    <span>{formatNumber(currentPlayer.gold)}</span>
                </div>
                <div className={`theme-stat-box !from-blue-900/60 ${!currentPlayer.ports && 'opacity-50'}`}>
                    <span>Ports</span>
                    <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
                    <span>{currentPlayer.ports}</span>
                </div>
                <div className={`theme-stat-box !from-green-900/60 ${!currentPlayer.cities && 'opacity-50'}`}>
                    <span>Cities</span>
                    <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
                    <span>{currentPlayer.cities}</span>
                </div>
            </div>
            <div className='theme-container'>
                <div className='p-4 flex flex-col w-full gap-2'>
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

            <div className='theme-container'>
                <div className='flex flex-col w-full gap-2 p-4'>
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
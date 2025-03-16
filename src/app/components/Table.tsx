import React from 'react';
import { formatNumber } from '../utils/NumberFormatter';
import { Alliance, Player } from '../interfaces/interfaces';

interface TableProps {
    className?: string;
    bodyClassName?: string;
    players: Player[];
    alliances: Alliance[];
    currentPlayerID?: string | null;
}

const Table: React.FC<TableProps> = ({ className, bodyClassName, players, alliances, currentPlayerID = null }) => {

    const isAlly = (player: Player) => {
        return alliances.some(a => a.player.id === player.id);
    }
    return (
        <div className={`theme-scrollbar h-full flex flex-col overflow-y-auto ${className}`}>
            <table className={`w-full relative text-left h-full max-h-max`}>
                <thead className='w-full sticky top-0 left-0'>
                    <tr className="bg-gray-800/50">
                        <th className=""><span className='w-full flex border-black border-b-2 p-2'>Rank</span></th>
                        <th className=""><span className='w-full flex border-black border-b-2 p-2'>Name</span></th>
                        <th className=""><span className='w-full flex border-black border-b-2 p-2'>Owned</span></th>
                        <th className=""><span className='w-full flex border-black border-b-2 p-2'>Gold</span></th>
                        <th className=""><span className='w-full flex border-black border-b-2 p-2'>Troops</span></th>
                    </tr>
                </thead>
                <tbody className={bodyClassName + ' text-center'}>
                    {players.filter(p => !p.isDead).sort((a, b) => b.area - a.area).map((player, index) => (
                        <tr key={index} className={`odd:bg-transparent even:bg-gray-800/50 h-max ${currentPlayerID === player.id && 'font-bold sticky bottom-0 left-0 !bg-gray-800'} ${isAlly(player) ? 'even:!bg-green-500/50 odd:!bg-green-500/30' : ''}`}>
                            <td className="p-2">{index + 1}</td>
                            <td className="text-left p-2">{player.name}</td>
                            <td className="p-2">{Math.round(player.area)}%</td>
                            <td className="p-2">{formatNumber(player.gold)}</td>
                            <td className="p-2">{formatNumber(player.troops)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;

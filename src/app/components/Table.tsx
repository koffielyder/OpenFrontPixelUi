import React from 'react';
import { Player } from '../page';
import { formatNumber } from '../utils/NumberFormatter';

interface TableProps {
    className?: string;
    bodyClassName?: string;
    players: Array<Player>
}

const Table: React.FC<TableProps> = ({ className, bodyClassName, players = [] }) => {
    return (
        <div className='theme-scrollbar h-full flex flex-col'>
            <table className={`w-full relative text-left ${className}`}>
            <thead className='w-full sticky top-0 left-0'>
                <tr className="bg-gray-800/50">
                    <th className=""><span className='w-full flex border-black border-b-2 p-2'>Rank</span></th>
                    <th className=""><span className='w-full flex border-black border-b-2 p-2'>Name</span></th>
                    <th className=""><span className='w-full flex border-black border-b-2 p-2'>Owned</span></th>
                    <th className=""><span className='w-full flex border-black border-b-2 p-2'>Gold</span></th>
                </tr>
            </thead>
            <tbody className={bodyClassName + ' text-center'}>
                {players.sort((a, b) => b.area - a.area).map((player, index) => (
                    <tr key={index} className="odd:bg-transparent even:bg-gray-800/50">
                        <td className="p-2">{index + 1}</td>
                        <td className="text-left p-2">{player.name}</td>
                        <td className="p-2">{player.area}%</td>
                        <td className="p-2">{formatNumber(player.gold)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
};

export default Table;

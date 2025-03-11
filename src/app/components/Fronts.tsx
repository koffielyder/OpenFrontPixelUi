import React from 'react';
import { Front } from '../interfaces/interfaces';


interface FrontsProps {
    className?: string;
    fronts: Front[];
}

const Fronts: React.FC<FrontsProps> = ({ className, fronts }) => {
    return (
        <div className={className}>
            {fronts.map((front, index) => (
                <div key={index} className="front">
                    <h3>{front.player.name}</h3>
                    <p>Incoming: {front.incoming}</p>
                    <p>Outgoing: {front.outgoing}</p>
                </div>
            ))}
        </div>
    );
};

export default Fronts;
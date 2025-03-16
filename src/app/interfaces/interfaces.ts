import { v4 as uuidv4 } from 'uuid';
interface Model {
    id: string;
}


export interface Player extends Model {
    name: string;
    area: number;
    population: number;
    maxPopulation: number;
    gold: number;
    ports: number;
    cities: number;
    isTraitor: boolean;
    hasEmbargo: boolean;
    nukesSent: number;
    workers: number;
    troops: number;
    attackRatio: number;
    alliance?: Alliance;
    isDead?: boolean;
    isWinner?: boolean;
}

export interface GameRequest extends Model {
    sender: Player;
    target: Player;
    title: string;
    type: 'alliance' | 'trade' | 'war';
    subTitle?: string;
    message: string;
    isRejected?: boolean;
    expires?: number;
    onAccept?: () => void;
    onReject?: () => void;
}

export interface Alliance extends Model {
    player: Player;
    level: number;
    gold: number;
    expires: number;
}

export interface Event extends Model {
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    priority?: number;
    turn: number;
}

export interface Front extends Model {
    player: Player;
    incoming: number;
    outgoing: number;
    idleTime?: number;
    
}

export interface Game {
    players: Player[];
    events: Event[];
    newEvents: Event[];
    fronts: Front[];
    alliances: Alliance[];
    currentPlayerIndex: number | null;
    turn: number;
    requests: GameRequest[];
    selectedPlayer: Player | null;
}

export const generateId = (): string => {
    return uuidv4();
}
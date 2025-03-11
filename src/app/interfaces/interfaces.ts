export interface Player {
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
}

export interface Alliance {
    isAlly: boolean;
    pending: boolean;
    level: number;
    gold: number;
    isRejected?: number;
    expires?: number;
}

export interface Event {
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    priority?: number;
}

export interface Front {
    player: Player;
    incoming: number;
    outgoing: number;
}
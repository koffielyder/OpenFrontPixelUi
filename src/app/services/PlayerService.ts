import { Game, generateId, Player } from "../interfaces/interfaces";
import { BOT_NAME_PREFIXES, BOT_NAME_SUFFIXES } from "../utils/BotNames";

export class PlayerService {
    private players: Player[];
    private currentplayerIndex: number | null;
    private areaAvailable: number;

    constructor() {
        this.players = [];
        this.currentplayerIndex = null;
        this.areaAvailable = 100;
    }

    init(): Player[] {
        this.players = this.generatePlayers();
        this.currentplayerIndex = 0;
        return this.players;
    }

    onTick(game: Game): object {
        this.players = this.players.map(p => this.onTickPlayer(p, game));
        return {players: this.players};
    }

    addRandomPlayer(): Player[] {
        this.addPlayer(this.generatePlayer());
        return this.players;
    }

    getPlayer(id: string | Player): Player | null {
        if (typeof id === 'object') id = id.id;
        return this.players.find(player => player.id === id) || null;
    }

    getRandomPlayer(exclude: string[] = [], excludeCurrent = true): Player | null {
        const excludeArray = this.getPlayerIndexesById(exclude);
        if (excludeCurrent && this.currentplayerIndex !== null) {
            excludeArray.push(this.currentplayerIndex);
        }

        let i = Math.floor(Math.random() * this.players.length);
        if (this.players.length <= excludeArray.length) return null;
        while (excludeArray.includes(i)) {
            i = Math.floor(Math.random() * this.players.length);
        }
        return this.players[i];
    }

    currentPlayer(): Player {
        if (!this.players.length) throw new Error('No players found');
        if (this.currentplayerIndex === null) {
            return this.players[0];
        }
        return this.players[this.currentplayerIndex];
    }

    updatePlayer(player: Player, id: string | null = null): Player[] {
        const searchId = id || player.id;
        this.players = this.players.map(f => {
            if (f.id === searchId) {
                console.log('found player', f);
                console.log('new player', player);
                return { ...f, ...player };
            }
            return f;
        });
        return this.players;
    }

    private getPlayerIndexById(ids: string): number {
        return this.players.findIndex(player => player.id === ids);
    }

    private getPlayerIndexesById(ids: string[]): number[] {
        return ids.map(id => this.players.findIndex(player => player.id === id));
    }

    private addPlayer(player: Player): void {
        this.players.push(player);
    }

    private generatePlayers(amount = 10): Player[] {
        const players: Player[] = [];
        for (let i = 0; i < amount; i++) {
            players.push(this.generatePlayer());
        }
        return players;
    }

    private generatePlayer() {
        const prefix = BOT_NAME_PREFIXES[Math.floor(Math.random() * BOT_NAME_PREFIXES.length)];
        const suffixCount = Math.floor(Math.random() * 3) + 1;
        const suffixes: string[] = [];

        while (suffixes.length < suffixCount) {
            const suffix = BOT_NAME_SUFFIXES[Math.floor(Math.random() * BOT_NAME_SUFFIXES.length)];
            if (!suffixes.includes(suffix)) {
                suffixes.push(suffix);
            }
        }

        const population = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
        const isTraitor = Math.random() < 0.5;
        const hasEmbargo = Math.random() < 0.1;
        const nukesSent = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 20) + 1;

        const player: Player = {
            id: generateId(),
            name: `${prefix} ${suffixes.join(' ')}`,
            population: population,
            maxPopulation: population * 5,
            gold: 0,
            area: 0,
            ports: 0,
            cities: 0,
            isTraitor: isTraitor,
            hasEmbargo: hasEmbargo,
            nukesSent: nukesSent,
            troops: population,
            workers: 0,
            attackRatio: 20,
        };

        return player;
    }

    onTickPlayer(player: Player, game: Game): Player {
        const addPortOrCity = Math.random() < 0.1;
        const addPort = (addPortOrCity && Math.random() < 0.5) ? 1 : 0;
        const addCity = (addPortOrCity && !addPort) ? 1 : 0;
        const isCurrentPlayer = this.currentPlayer().id === player.id;
        game.fronts.forEach(front => {
            if (front.player.id === player.id || isCurrentPlayer) {
                const diff = !isCurrentPlayer ? front.incoming - front.outgoing : front.outgoing - front.incoming;
                if (diff === 0) return;
                player.area += diff > 0 ? 1 : -1;
                if (player.area <= 0) {
                    if(isCurrentPlayer) {
                        player.area = 1;
                    } else {
                        player.area = 0;
                        player.isDead = true;
                    }
                }
            }
        });
        player.population = Math.min(Math.floor(player.population * 1.05), player.maxPopulation);
        player.gold += Math.floor(1000 * Math.random());
        player.ports += addPort;
        player.cities += addCity;
        if (this.areaAvailable > 0) {
            const areaChange = Math.min(this.areaAvailable, player.area === 0 ? 0.5 : Math.max(1.5, player.area * (Math.random() * 0.5)));
            player.area += areaChange;
            this.areaAvailable -= areaChange;
        }
        return player;
    }

    calcArea(): number {
        return this.players.reduce((acc, player) => acc + player.area, 0);
    }


}
import { Front, Game, GameRequest, Player } from "../interfaces/interfaces";
import { PlayerService } from "./PlayerService";
import { FrontService } from "./FrontService";
import { EventService } from "./EventService";
import { RequestService } from "./RequestService";
import { AllianceService } from "./AllianceService";

export class GameService {
    private interval: NodeJS.Timeout | null;
    private playerService: PlayerService;
    private frontService: FrontService;
    private eventService: EventService;
    private requestService: RequestService;
    private allianceService: AllianceService;
    

    isActive: boolean;
    onUpdate: (game: Game) => void;
    game: Game | null;


    constructor(onUpdate: (game: Game) => void) {
        this.onUpdate = onUpdate;
        this.interval = null;
        this.game = null;
        this.isActive = false;
        this.playerService = new PlayerService();
        this.frontService = new FrontService();
        this.eventService = new EventService();
        this.requestService = new RequestService();
        this.allianceService = new AllianceService();
    }

    // player service handlers
    addRandomPlayer(): void {
        if (!this.game) return;
        this.game.players = this.playerService.addRandomPlayer();
        this.onUpdate(this.game);
    }
    
    getCurrentPlayer(): Player | null {
        if (!this.game) return null;
        return this.playerService.currentPlayer();
    }

    // front service handlers
    addRandomFront(): void {
        if (!this.game) return;
        const player = this.playerService.getRandomPlayer(this.game.fronts.map(f => f.player.id), true);
        if (!player) return;
        this.game.fronts = this.frontService.newFront(player);
        this.onUpdate(this.game);
    }

    sendTroops(front: Front, player: Player | null): void {
        if (!this.game) return;
        if (!player) player = this.playerService.currentPlayer();
        else player = this.playerService.getPlayer(player);

        if (!player) return;
        this.handleTroopSend(front, player);
    }


    // event service handlers
    addRandomEvent(): void {
        if (!this.game) return;
        const player = this.playerService.getRandomPlayer();
        if(!player) return;
        this.game = { ...this.game, ...this.eventService.newEvent(player, this.game.turn) };
        this.onUpdate(this.game);
    }

    addEvent(event: string, data: { [key: string]: string | number }): void {
        if (!this.game) return;
        this.game = { ...this.game, ...this.eventService.addEventByKey(event, data, this.game.turn) };
        this.onUpdate(this.game);
    }

    // request service handlers
    addAllianceRequest(): void {
        if (!this.game) return;
        const sendingPlayer = this.playerService.getRandomPlayer([...this.game.alliances.map(a => a.player.id), ...this.game.requests.map(r => r.sender.id)], true);
        const currentPlayer = this.playerService.currentPlayer();
        if (!sendingPlayer || !currentPlayer) return;
        
        const request: GameRequest = this.allianceService.createAllianceRequest(sendingPlayer, currentPlayer, this.game.turn, 
            (response: boolean) => {
                if (!this.game) return;
                if(response) {
                    this.game.requests = this.requestService.removeRequest(request);
                    this.newAlliance(sendingPlayer);
                } else {
                    this.game = { ...this.game, ...this.requestService.rejectRequest(request, this.game.turn) };
                    this.onUpdate(this.game);
                }
            });

        this.game.requests = this.requestService.addRequest(request);
        this.onUpdate(this.game);
    }

    // alliance service handlers
    newAlliance(player: Player): void {
        if (!this.game) return;
        this.game = { ...this.game, ...this.allianceService.newAlliance(player, this.game.turn) };
        this.onUpdate(this.game);
    }

    selectPlayer(player: Player | null): void {
        if (!this.game) return;
        this.game.selectedPlayer = player;
        this.onUpdate(this.game);
    }

    selectRandomPlayer(): void {
        if (!this.game) return;
        this.selectPlayer(this.playerService.getRandomPlayer());
    }

    sendAllianceRequest(player: Player): void {
        const currentPlayer = this.playerService.currentPlayer();
        if (!this.game || !currentPlayer) return;
        const request: GameRequest = this.allianceService.createAllianceRequest(currentPlayer, player, this.game.turn, 
            (response: boolean) => {
                if (!this.game) return;
                if(response) {
                    this.game.requests = this.requestService.removeRequest(request);
                    this.newAlliance(player);
                    this.eventService.addEventByKey('alliance.accepted', { player: player.name }, this.game.turn);
                } else {
                    this.game = { ...this.game, ...this.requestService.rejectRequest(request, this.game.turn) };
                    this.onUpdate(this.game);
                    this.eventService.addEventByKey('alliance.rejected', { player: player.name }, this.game.turn);
                }
            });

        this.game.requests = this.requestService.addRequest(request);
        this.onUpdate(this.game);
    }

    // Game
    init(): void {
        this.game = {
            players: this.playerService.init(),
            fronts: this.frontService.init(),
            events: this.eventService.init(),
            newEvents: this.eventService.init(),
            alliances: this.allianceService.init(),
            requests: this.requestService.init(),
            currentPlayerIndex: null,
            turn: 0,
            selectedPlayer: null,
        };

        this.onUpdate(this.game);
    }


    start(): void {
        if (!this.game) this.init();
        if (!this.game) return;


        this.isActive = true;
        this.interval = setInterval(() => {
            this.onTick();
        }, 1000);
    }

    end(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.isActive = false;
            this.interval = null;
        }
    }

    toggle(): void {
        if (this.interval) this.end();
        else this.start();
    }

    private onTick(): void {
        if (!this.game) return;
        this.game = { ...this.game, ...this.frontService.onTick(this) };
        this.game = { ...this.game, ...this.eventService.onTick(this.game) };
        this.game = { ...this.game, ...this.playerService.onTick(this.game) };
        this.game = { ...this.game, ...this.allianceService.onTick(this) };
        this.game = { ...this.game, ...this.requestService.onTick(this) };
        this.game.turn++;
        this.onUpdate(this.game);
    }

    private handleTroopSend(front: Front, player: Player): void {
        if (!this.game) return;
        const troopsSend = Math.round(player.troops * (player.attackRatio / 100));
        if (player.id == this.playerService.currentPlayer().id) {
            this.game.fronts = this.frontService.sendOutgoingTroops(front, troopsSend);
        } else {
            this.game.fronts = this.frontService.sendIncomingTroops(front, troopsSend);
        }

        this.game.players = this.playerService.updatePlayer({ ...player, troops: Math.max(0, player.troops - troopsSend) });
        this.onUpdate(this.game);
    }
}
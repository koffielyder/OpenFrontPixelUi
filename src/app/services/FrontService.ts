import { Front, generateId, Player } from "../interfaces/interfaces";
import { GameService } from "./GameService";

export class FrontService {
    private fronts: Front[];

    constructor() {
        this.fronts = [];
    }

    init(): Front[] {
        return this.fronts;
    }
    onTick(gameService: GameService): object {
        if (gameService.game === null) {
            return { fronts: this.fronts }
        };
        this.fronts = this.fronts.map(front => this.onTickFront(front)).filter(front => !front.idleTime || front.idleTime < 4 && !front.player.isDead);

        if (gameService.game.turn > 3 && Math.random() < 0.2) {
            if (gameService.game.fronts.length < 1) {
                const randomPlayer = gameService.getCurrentPlayer();
                if (randomPlayer) this.newFront(randomPlayer);
            } else {
                const playersWithoutFront = gameService.game.players.filter(player =>
                    player.id !== gameService.getCurrentPlayer()?.id &&
                    !gameService.game?.fronts.some(front => front.player.id === player.id) &&
                    !gameService.game?.alliances.some(alliance => alliance.player.id === player.id)
                );
                if (Math.random() < (1 / gameService.game.fronts.length) && playersWithoutFront.length) {
                    const randomPlayer = playersWithoutFront[Math.floor(Math.random() * playersWithoutFront.length)];
                    this.newFront(randomPlayer);
                } else {
                    const randomFront = gameService.game.fronts[Math.floor(Math.random() * gameService.game.fronts.length)];
                    if (randomFront) {
                        this.sendIncomingTroops(randomFront, Math.floor(Math.random() * randomFront.player.troops));
                    }
                }
            }
        }
        return { fronts: this.fronts };
    }

    newFront(player: Player): Front[] {
        this.fronts.push(this.generateFront(player));
        return this.fronts;
    }

    sendOutgoingTroops(front: Front, amount: number): Front[] {
        return this.updateFront({ ...front, outgoing: front.outgoing + amount });
    }

    sendIncomingTroops(front: Front, amount: number): Front[] {
        return this.updateFront({ ...front, incoming: front.incoming + amount });
    }


    updateFront(front: Front): Front[] {
        this.fronts = this.fronts.map(f => {
            if (f.id === front.id) {
                return { ...f, ...front };
            }
            return f;
        });
        return this.fronts;
    }

    removeFront(front: Front): Front[] {
        this.fronts = this.fronts.filter(f => f.id !== front.id);
        console.log('removeFront', this.fronts, front.id);
        return this.fronts;
    }


    private generateFront(player: Player): Front {
        return {
            id: generateId(),
            player: player,
            incoming: player.troops * (player.attackRatio / 100),
            outgoing: Math.floor(0),
        };
    }

    private onTickFront(front: Front): Front {
        const updatedFront = {
            ...front,
            incoming: Math.max(0, front.incoming - 800 - (front.outgoing * 0.05)),
            outgoing: Math.max(0, front.outgoing - 800 - (front.incoming * 0.05)),
        }
        if (front.incoming === 0 && front.outgoing === 0) {
            updatedFront.idleTime = (updatedFront.idleTime || 0) + 1;
        } else {
            updatedFront.idleTime = 0;
        }
        return updatedFront;
    }
}
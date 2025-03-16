import { Alliance, GameRequest, generateId, Player, } from "../interfaces/interfaces";
import { GameService } from "./GameService";


export class AllianceService {
    private alliances: Alliance[];

    constructor() {
        this.alliances = [];
    }

    init(): Alliance[] {
        return this.alliances;
    }
    onTick(gameService: GameService): object {
        if (gameService.game === null) {
            return { alliances: this.alliances }
        };

        this.alliances = this.alliances.map(alliance => this.onTickAlliance(alliance)).filter(alliance => {
            const result = gameService.game && alliance.expires > gameService.game.turn;
            if (!result) gameService.addEvent('alliance.expired', { player: alliance.player.name });
            return result
        });
        return this.returnData();
    }

    newAlliance(player: Player, turn: number): { alliances: Alliance[] } {
        const existingAlliance = this.alliances.find(a => a.player.id === player.id);
        if (existingAlliance) return this.returnData();
        const alliance: Alliance = {
            id: generateId(),
            player: player,
            expires: turn + 20,
            level: 1,
            gold: 0,
        }
        return this.addAlliance(alliance);
    }

    updateAlliance(alliance: Alliance): { alliances: Alliance[] } {
        this.alliances = this.alliances.map(f => {
            if (f.id === alliance.id) {
                return { ...f, ...alliance };
            }
            return f;
        });
        return this.returnData();
    }

    removeAlliance(alliance: Alliance): { alliances: Alliance[] } {
        this.alliances = this.alliances.filter(f => f.id !== alliance.id);
        return this.returnData();
    }

    addAlliance(alliance: Alliance): { alliances: Alliance[] } {
        this.alliances.push(alliance);
        return this.returnData();
    }

    returnData(): { alliances: Alliance[] } {
        return { alliances: this.alliances };
    }

    createAllianceRequest(sender: Player, target: Player, turn: number, onAnswer: (response: boolean) => void): GameRequest {
        return {
            id: generateId(),
            type: 'alliance',
            sender: sender,
            target: target,
            title: `Alliance request from ${sender.name}`,
            message: `${sender.name} wants to form an alliance with you`,
            isRejected: false,
            expires: turn + 5,
            onAccept: () => onAnswer(true),
            onReject: () => onAnswer(false)
        }
    }

    private onTickAlliance(alliance: Alliance): Alliance {
        return alliance;
    }

}
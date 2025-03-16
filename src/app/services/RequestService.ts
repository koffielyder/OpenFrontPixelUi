import { GameRequest } from "../interfaces/interfaces";
import { GameService } from "./GameService";


export class RequestService {
    private requests: GameRequest[];

    constructor() {
        this.requests = [];
    }

    init(): GameRequest[] {
        return this.requests;
    }

    onTick(gameService: GameService): object {
        const game = gameService.game;
        if (!game) return { requests: this.requests };
        this.requests = this.requests
            .map(request => {
                if (request.expires && request.expires <= game.turn) {
                    if (!request.isRejected) {
                        return { ...request, isRejected: true, expires: game.turn + 5 };
                    }
                    return request;
                }
                return request;
            })
            .filter(request => !request.expires || request.expires > game.turn);

        this.requests.forEach(request => {
            if(request.target.id == gameService.getCurrentPlayer()?.id || request.isRejected) return;
            if (request.onAccept && Math.random() < 0.5) request.onAccept();
            else if (request.onReject && Math.random() < 0.5) request.onReject();
        });
        return { requests: this.requests };
    }

    updateRequest(request: GameRequest): GameRequest[] {
        this.requests = this.requests.map(f => {
            if (f.id === request.id) {
                return { ...f, ...request };
            }
            return f;
        });
        return this.requests;
    }

    removeRequest(request: GameRequest): GameRequest[] {
        this.requests = this.requests.filter(f => f.id !== request.id);
        return this.requests;
    }

    rejectRequest(request: GameRequest, turn: number): object {
        this.requests = this.requests.map(f => {
            if (f.id === request.id) {
                return { ...f, isRejected: true, expires: turn + 5, };
            }
            return f;
        });
        return { requests: this.requests };
    }

    addRequest(request: GameRequest): GameRequest[] {
        this.requests.push(request);
        return this.requests;
    }
}
import { Front, Player } from "../interfaces/interfaces";

export class FrontService {
    private fronts: Front[];
    private onFrontsChange: (fronts: Front[]) => void;

    constructor(fronts: Front[], onFrontsChange: (fronts: Front[]) => void) {
        this.fronts = fronts;
        this.onFrontsChange = onFrontsChange;
    }

    private getTroopSize(player: Player): number {
        return player.troops * (player.attackRatio / 100);
    }

    private randomFront(): Front {
        const randomIndex = Math.floor(Math.random() * this.fronts.length);
        return this.fronts[randomIndex];
    }

    public addIncoming(front: Front | null = null): Front[] {
        if (!front) front = this.randomFront();
        this.setFronts((prevFronts) =>
            prevFronts.map((f) => {
                if (f === front) {
                    return { ...f, incoming: f.incoming + this.getTroopSize(f.player) };
                }
                return f;
            })
        );
        return this.fronts;
    }

    public addOutgoing(front: Front | null = null): Front[] {
        if (!front) front = this.randomFront();
        this.setFronts((prevFronts) =>
            prevFronts.map((f) => {
                if (f === front) {
                    return { ...f, outgoing: f.outgoing + this.getTroopSize(f.player) };
                }
                return f;
            })
        );
        return this.fronts;
    }

    public generateFront(player: Player): void {
        const front: Front = {
            player: player,
            incoming: this.getTroopSize(player),
            outgoing: Math.floor(Math.random() * 100),
        };
        this.setFronts((prevFronts) => [...prevFronts, front]);
    }

    private setFronts(updateFn: (prevFronts: Front[]) => Front[]): void {
        this.fronts = updateFn(this.fronts);
        this.onFrontsChange(this.fronts);
    }

    public onTick(): void {
        this.setFronts((prevFronts) =>
            prevFronts.map((front) => {
                const incomingReduction = Math.round(front.outgoing * 0.10) + 1000;
                const outgoingReduction = Math.round(front.incoming * 0.10) + 1000;
                
                let newIncoming = Math.max(0, Math.round(front.incoming * 0.95) - incomingReduction);
                let newOutgoing = Math.max(0, Math.round(front.outgoing * 0.95) - outgoingReduction);

                const idleTime = (newIncoming === 0 && newOutgoing === 0) ? (front.idleTime || 0) + 1 : 0;

                if (Math.random() < ((front.outgoing ? 0 : 0.01) + (front.outgoing > front.incoming ? 0.04 : 0))) {
                    newIncoming += this.getTroopSize(front.player);
                }

                return {
                    ...front,
                    incoming: newIncoming,
                    outgoing: newOutgoing,
                    idleTime: idleTime,
                };
            }).filter((front) => front.idleTime < 3)
        );
    }
}

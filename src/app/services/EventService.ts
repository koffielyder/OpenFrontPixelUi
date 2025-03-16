import { Event, Game, generateId, Player, } from "../interfaces/interfaces";
import _ from 'lodash';

const dummyEvents: { [key: string]: { [key: string]: Event } } = {
    alliance: {
        rejected: { id: generateId(), message: '{player} declined your alliance request', type: 'warning', priority: 2, turn: 0 },
        accepted: { id: generateId(), message: '{player} accepted your alliance request', type: 'success', priority: 2, turn: 0 },
        brokeAlliance: { id: generateId(), message: '{player} broke their alliance with you', type: 'danger', priority: 3, turn: 0 },
        expired: { id: generateId(), message: 'Alliance with {player} is expired', type: 'danger', priority: 3, turn: 0 },
    },
    war: {
        conqueredPlayer: { id: generateId(), message: 'Conquered {player} received 100k gold', type: 'success', priority: 1, turn: 0 },
        capturedPort: { id: generateId(), message: 'Captured port from {player}', type: 'success', priority: 1, turn: 0 },
        capturedCity: { id: generateId(), message: 'Captured city from {player}', type: 'success', priority: 1, turn: 0 },
        capturedWarship: { id: generateId(), message: 'Captured warship from {player}', type: 'success', priority: 1, turn: 0 },
        lostPort: { id: generateId(), message: 'Lost port to {player}', type: 'danger', priority: 1, turn: 0 },
        lostCity: { id: generateId(), message: 'Lost city to {player}', type: 'danger', priority: 1, turn: 0 },
        warshipDestroyed: { id: generateId(), message: 'Warship destroyed by {player}', type: 'danger', priority: 1, turn: 0 },
    },
    trade: {
        tradeShipCaptured: { id: generateId(), message: 'Captured trade ship from {player}', type: 'success', priority: 1, turn: 0 },
        tradeShipCaught: { id: generateId(), message: 'Captured trade ship by {player}', type: 'danger', priority: 1, turn: 0 },
        tradeRecieved: { id: generateId(), message: 'Recieved {amount} from trade with {player}', type: 'success', priority: 1, turn: 0 },
    }
};

export class EventService {
    private events: Event[];
    private newEvents: Event[];

    constructor() {
        this.events = [];
        this.newEvents = [];
    }

    init(): Event[] {
        return this.events;
    }
    onTick(game: Game): object {
        this.newEvents = this.events.filter(event => (event.turn + 3) > game.turn);
        if (game.fronts.length) {
            game.fronts.forEach(front => {
                if (!(front.incoming == front.outgoing)) {
                    if (Math.random() < 0.2) {
                        const events = front.incoming > front.outgoing
                            ? [dummyEvents.war.lostCity, dummyEvents.war.lostPort, dummyEvents.war.warshipDestroyed]
                            : [dummyEvents.war.capturedCity, dummyEvents.war.capturedPort, dummyEvents.war.capturedWarship];

                        const randomEvent = events[Math.floor(Math.random() * events.length)];
                        randomEvent.turn = game.turn;
                        this.addEvent(randomEvent, { player: front.player.name }, game.turn);
                    }
                }
            });
        }
        if (game.turn % Math.floor(Math.random() * 20) === 0) {
            const player = game.players[Math.floor(Math.random() * game.players.length)];
            if (player) this.newEvent(player, game.turn);
        }
        return this.returnData();
    }

    newEvent(player: Player, turn: number): object {
        const event = this.generateEvent(player, turn);
        this.events.push(event);
        this.newEvents.push(event);
        return this.returnData();
    }

    updateEvent(event: Event): object {
        this.events = this.events.map(f => {
            if (f.id === event.id) {
                return { ...f, ...event };
            }
            return f;
        });
        return this.returnData();
    }

    removeEvent(event: Event): object {
        this.events = this.events.filter(f => f.id !== event.id);
        return this.returnData();
    }

    generateEvent(player: Player, turn: number): Event {
        const eventKeys = Object.keys(dummyEvents.trade);
        const randomKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
        const randomEvent = dummyEvents.trade[randomKey];
        const event = this.parseEvent(randomEvent, { player: player.name, amount: Math.floor(Math.random() * 1000) });
        event.turn = turn;
        return event;
    }

    addEvent(event: Event, data: { [key: string]: string | number }, turn: number): object {
        const parsedEvent = this.parseEvent(event, data);
        parsedEvent.turn = turn;
        this.events.push(parsedEvent);
        this.newEvents.push(parsedEvent);
        return this.returnData();
    }

    addEventByKey(eventKey: string, data: { [key: string]: string | number }, turn: number): object {
        const event = _.get(dummyEvents, eventKey) as unknown as Event;
        if (!event || typeof event.id !== 'string' || typeof event.message !== 'string' || typeof event.type !== 'string' || typeof event.priority !== 'number' || typeof event.turn !== 'number') {
            return this.returnData();
        }
        return this.addEvent(event, data, turn);
    }

    parseEvent(event: Event, data: { [key: string]: string | number }): Event {
        let parsedMessage = event.message;
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const regex = new RegExp(`{${key}}`, 'g');
                parsedMessage = parsedMessage.replace(regex, String(data[key]));
            }
        }
        return { ...event, message: parsedMessage, id: generateId() };
    }

    returnData = (): object => {
        return { events: this.events, newEvents: this.newEvents };
    }

}
import React, { useState, useRef, useEffect } from 'react';
import Table from '../components/Table';
import { BOT_NAME_PREFIXES, BOT_NAME_SUFFIXES } from '../utils/BotNames';
import Dialog from '../components/Dialog';
import PlayerStats from '../components/PlayerStats';
import EventLog from '../components/EventLog';
import Button from '../components/Button';
import Requests from '../components/Requests';
import PlayerInfoDialog from '../components/PlayerInfoDialog';

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
}

export interface Event {
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    priority?: number;
}

interface Request {
    title: string;
    subTitle: string;
    message: string;
}

const dummyEvents: Event[] = [
    { message: '{player} declined your alliance request', type: 'warning', priority: 2 },
    { message: '{player} accepted your alliance request', type: 'success', priority: 2 },
    { message: '{player} broke their alliance with you', type: 'danger', priority: 3 },
    { message: 'Conquered {player} recieved 100k gold', type: 'success', priority: 1 },
    { message: 'Captured port from {player}', type: 'success', priority: 1 },
    { message: 'Captured city from {player}', type: 'success', priority: 1 },
    { message: 'Captured warship from {player}', type: 'success', priority: 1 },
    { message: 'Lost port to {player}', type: 'danger', priority: 1 },
    { message: 'Lost city to {player}', type: 'danger', priority: 1 },
    { message: 'Warship destroyed by {player}', type: 'danger', priority: 1 },

];

const Game: React.FC = () => {
    const [dummyPlayers, setDummyPlayers] = React.useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
    const [currentPlayer, setCurrentPlayer] = React.useState<Player | null>(null);
    const [events, setEvents] = React.useState<Event[]>([]);
    const [newEvents, setNewEvents] = React.useState<Event[]>([]);

    const [requests, setRequests] = React.useState<Request[]>([]);
    const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout | null>(null);

    const generatePlayers = (amount = 6) => {
        const players: Player[] = [];
        for (let i = 0; i < amount; i++) {
            players.push(generatePlayer());
        }
        setDummyPlayers(players);
        setCurrentPlayer(players[0]);
    };

    const generatePlayer = () => {
        const prefix = BOT_NAME_PREFIXES[Math.floor(Math.random() * BOT_NAME_PREFIXES.length)];
        const suffixCount = Math.floor(Math.random() * 3) + 1;
        const suffixes: string[] = [];

        while (suffixes.length < suffixCount) {
            const suffix = BOT_NAME_SUFFIXES[Math.floor(Math.random() * BOT_NAME_SUFFIXES.length)];
            if (!suffixes.includes(suffix)) {
                suffixes.push(suffix);
            }
        }

        const population = Math.floor(Math.random() * (1000000 - 100 + 1)) + 100;
        const gold = Math.floor(Math.random() * (1000000 - 100 + 1)) + 100;
        const area = Math.floor(Math.random() * 10);
        const ports = Math.floor(Math.random() * 16);
        const cities = Math.floor(Math.random() * 16);
        const isTraitor = Math.random() < 0.5;
        const hasEmbargo = Math.random() < 0.1;
        const nukesSent = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 20) + 1;

        const player: Player = {
            name: `${prefix} ${suffixes.join(' ')}`,
            population: population,
            maxPopulation: population * 5,
            gold: gold,
            area: area,
            ports: ports,
            cities: cities,
            isTraitor: isTraitor,
            hasEmbargo: hasEmbargo,
            nukesSent: nukesSent,
            troops: population,
            workers: 0,
            attackRatio: 20,
        };

        return player;
    };

    const randomPlayer = () => {
        const randomIndex = Math.floor(Math.random() * dummyPlayers.length);
        return dummyPlayers[randomIndex];
    }

    // const selectRandomPlayer = () => {
    //     setSelectedPlayer(randomPlayer());
    // }

    const parseEvent = (event: Event) => {
        const player = randomPlayer();
        if(player) return { ...event, message: event.message.replace('{player}', player.name) };
        return event;
    };

    const sendAllianceRequest = () => {
        const player = randomPlayer();
        const request = {
            title: 'Alliance Request',
            subTitle: player.name,
            message: player.name + ' requests an alliance',
        };
        setRequests((prevRequests) => [...prevRequests, request]);
    };

    const randomEvent = () => {
        const randomIndex = Math.floor(Math.random() * dummyEvents.length);
        const randomEvent = dummyEvents[randomIndex];
        const parsedEvent = parseEvent(randomEvent);
        setEvents((prevEvents) => [...prevEvents, parsedEvent]);
        setNewEvents((prevNewEvents) => [...prevNewEvents, parsedEvent]);

        // Remove the event after x seconds
        const eventDuration = 5000; // 5 seconds
        setTimeout(() => {
            setNewEvents((prevEvents) => prevEvents.filter(event => event !== parsedEvent));
        }, eventDuration);
    };

    const randomAction = () => {
        const randomNumber = Math.random();
        switch (true) {
            case randomNumber < 0.4:
                randomEvent();
                break;
            case randomNumber < 0.45:
                sendAllianceRequest();
                break;
            default:
                break;
        }
    };

    const toggleRandomEvents = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        } else {
            const id = setInterval(randomAction, 1000);
            setIntervalId(id);
        }
    };

    useEffect(() => {
        generatePlayers();
    }, []);
    

    return (
        <div className='flex relative w-full h-full justify-between'>
            <div className="w-1/4 h-full flex flex-col justify-between">
                <Dialog label="Leaderboard">
                    <Table players={dummyPlayers} />
                </Dialog>
                {currentPlayer && <PlayerStats player={currentPlayer} onPlayerChange={(player: Player) => setCurrentPlayer(player)} />}
            </div>
            <div className="w-1/4 h-full flex flex-col justify-between">
                <Requests requests={requests} onRequestsChange={(requests) => setRequests(requests)} />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full">
                    {selectedPlayer && <PlayerInfoDialog player={selectedPlayer} open={selectedPlayer !== null} onClose={() => setSelectedPlayer(null)} />}
                </div>
            </div>
            <div className="w-1/4 h-full flex flex-col justify-between">
                <div className='w-full gap-4 grid grid-cols-2'>
                    <Button onClick={randomEvent} className='bg-yellow-400' >
                        Random Event
                    </Button>

                    <Button onClick={sendAllianceRequest} className='bg-green-400' >
                        Alliance request
                    </Button>

                    <Button onClick={toggleRandomEvents} className='bg-red-400' >
                        [{!intervalId ? 'off' : 'on'}] Toggle random events
                    </Button>
                </div>
                <EventLog className='max-h-[40vh] w-full' events={events} newEvents={newEvents} showAll={false} />
            </div>
        </div>
    );
};

export default Game;

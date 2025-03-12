import React, { useEffect } from 'react';
import Table from '../components/Table';
import { BOT_NAME_PREFIXES, BOT_NAME_SUFFIXES } from '../utils/BotNames';
import Button from '../components/Button';
import Requests from '../components/Requests';
import PlayerInfoDialog from '../components/PlayerInfoDialog';
import { Event, Front, Player } from '../interfaces/interfaces';
import Dialog from '../components/Dialog';
import PlayerStats from '../components/PlayerStats';
import Fronts from '../components/Fronts';
import EventLog from '../components/EventLog';
import { get } from 'http';

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
    const [fronts, setFronts] = React.useState<Front[]>([]);

    const generateFront = () => {
        const player = randomPlayer();
        const front: Front = {
            player: player,
            incoming: getTroopSize(player),
            outgoing: Math.floor(Math.random() * 100),
        }
        setFronts((prevFronts) => [...prevFronts, front]);
    }



    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setFronts((prevFronts) => prevFronts.map((front) => ({
    //             ...front,
    //             incoming: Math.round(Math.max(0, front.incoming *.95)),
    //             outgoing: Math.round(Math.max(0, front.outgoing *.95)),
    //         })));
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    const getTroopSize = (player: Player) => {
        return player.troops * (player.attackRatio / 100);
    }




    const generatePlayers = (amount = 10) => {
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
        // const isAlly = Math.random() < 0.2;
        const isAlly = false;
        const expires = Math.floor(Math.random() * 151) + 50;

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
            alliance: { isAlly: isAlly, pending: false, level: Math.round(Math.random() * 3), gold: gold, expires: expires },
        };

        return player;
    };

    const randomPlayer = () => {
        const randomIndex = Math.floor(Math.random() * dummyPlayers.length);
        return dummyPlayers[randomIndex];
    }

    const selectRandomPlayer = () => {
        setSelectedPlayer(randomPlayer());
    }

    const parseEvent = (event: Event) => {
        const player = randomPlayer();
        if (player) return { ...event, message: event.message.replace('{player}', player.name) };
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
        <div className='relative w-full h-full grid grid-rows-2 gap-16'>
            {selectedPlayer && <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full z-20 flex justify-center items-center">
                {selectedPlayer && <PlayerInfoDialog player={selectedPlayer} open={selectedPlayer !== null} onClose={() => setSelectedPlayer(null)} />}
            </div>}
            <div className='relative w-full h-full justify-between grid grid-cols-[1fr_2fr_1fr] grid-rows-1 gap-4'>
                <div id='container-top-left' className="h-full w-full">
                    <Dialog>
                        <Table players={dummyPlayers} className='max-h-full' />
                    </Dialog>
                </div>

                <div id='container-top-middle' className="h-1/2">
                    <Requests requests={requests} onRequestsChange={(requests) => setRequests(requests)} />
                </div>

                <div id='container-top-right' className="h-full w-full">
                    <div className='w-full gap-4 grid grid-cols-2 p-4'>
                        <Button onClick={randomEvent} className='bg-yellow-400' >
                            Random Event
                        </Button>

                        <Button onClick={sendAllianceRequest} className='bg-green-400' >
                            Alliance request
                        </Button>

                        <Button onClick={toggleRandomEvents} className='bg-red-400' >
                            [{!intervalId ? 'off' : 'on'}] Toggle random events
                        </Button>

                        <Button onClick={selectRandomPlayer}>
                            Open player dialog
                        </Button>
                        <Button label='generateFront' onClick={generateFront} />
                    </div>
                </div>
            </div>
            <div className="relative w-full h-full justify-between grid grid-cols-3 grid-cols-[2fr_2fr_1fr] gap-4 items-end">

                <div id="container-bottom-left" className="h-full w-full flex gap-4 items-end overflow-hidden">
                    {currentPlayer && <PlayerStats player={currentPlayer} onPlayerChange={(player: Player) => setCurrentPlayer(player)} />}
                </div>

                <div id="container-bottom-middle" className="h-1/2">
                    <Fronts fronts={fronts} className='h-full' />
                </div>

                <div id="container-bottom-right" className="h-full w-full flex items-end">
                    <EventLog className='max-h-[40vh] w-full' events={events} newEvents={newEvents} showAll={false} />
                </div>
            </div>
            {/* <div className="w-1/4 h-full flex flex-col justify-between">
                <Dialog label="Leaderboard">
                    <Table players={dummyPlayers} className='max-h-[30vh]' />
                </Dialog>
                {currentPlayer && <PlayerStats player={currentPlayer} onPlayerChange={(player: Player) => setCurrentPlayer(player)} />}
            </div>
            <div className="w-1/4 h-full flex flex-col justify-between relative">
                <Requests requests={requests} onRequestsChange={(requests) => setRequests(requests)} />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full">
                    {selectedPlayer && <PlayerInfoDialog player={selectedPlayer} open={selectedPlayer !== null} onClose={() => setSelectedPlayer(null)} />}
                </div>
            </div>
            <div className="w-1/4 h-full flex flex-col justify-between">
                <div className='w-full gap-4 grid grid-cols-2 p-4'>
                    <Button onClick={randomEvent} className='bg-yellow-400' >
                        Random Event
                    </Button>

                    <Button onClick={sendAllianceRequest} className='bg-green-400' >
                        Alliance request
                    </Button>

                    <Button onClick={toggleRandomEvents} className='bg-red-400' >
                        [{!intervalId ? 'off' : 'on'}] Toggle random events
                    </Button>

                    <Button onClick={selectRandomPlayer}>
                        Open player dialog
                    </Button>

                </div>
                <EventLog className='max-h-[40vh] w-full' events={events} newEvents={newEvents} showAll={false} />
            </div> */}
        </div>
    );
};

export default Game;

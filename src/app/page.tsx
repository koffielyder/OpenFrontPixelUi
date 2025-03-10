'use client';
import Image from "next/image";
import Button from "./components/Button";
import Table from "./components/Table";
import UiWindow from "./components/UiWindow";
import PlayerStats from "./components/PlayerStats";
import EventLog from "./components/EventLog";
import React from "react";
import Requests from "./components/Requests";
import { BOT_NAME_PREFIXES, BOT_NAME_SUFFIXES } from "./utils/BotNames";
import PlayerInfoDialog from "./components/PlayerInfoDialog";


export interface Player {
  name: string;
  area: number;
  population: string | number;
  gold: string | number;
  ports: number;
  cities: number;
  isTraitor: boolean;
  hasEmbargo: boolean;
  nukesSent: number;
}

interface Event {
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  priority?: number;
}

interface Request {
  title: string;
  subTitle: string;
  message: string;
}

// const dummyPlayers = [
//   { name: 'General_Maximus_Decimus_Meridius', score: 1000 },
//   { name: 'Warlord_Genghis_Khan', score: 900 },
//   { name: 'Emperor_Napoleon_Bonaparte', score: 800 },
//   { name: 'King_Leonidas_of_Sparta', score: 700 },
//   { name: 'Queen_Boudica_of_the_Iceni', score: 600 },
//   { name: 'Pharaoh_Ramesses_the_Great', score: 500 },
//   { name: 'Sultan_Suleiman_the_Magnificent', score: 400 },
//   { name: 'Shogun_Tokugawa_Ieyasu', score: 300 },
//   { name: 'Czar_Peter_the_Great', score: 200 },
// ];

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

export default function Home() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [requests, setRequests] = React.useState<Request[]>([]);
  const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout | null>(null);
  const [dummyPlayers, setDummyPlayers] = React.useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);

  const generatePlayers = (amount = 6) => {
    const players: Player[] = [];
    for (let i = 0; i < amount; i++) {
      players.push(generatePlayer());
    }
    setDummyPlayers(players);
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

    const population = Math.floor(Math.random() * (10000000 - 100 + 1)) + 100;
    const formattedPopulation = population >= 1000000 ? (population / 1000000).toFixed(1) + 'M' : (population / 1000).toFixed(1) + 'K';

    const gold = Math.floor(Math.random() * (10000000 - 100 + 1)) + 100;
    const formattedGold = gold >= 1000000 ? (gold / 1000000).toFixed(1) + 'M' : (gold / 1000).toFixed(1) + 'K';

    const area = Math.floor(Math.random() * 10);
    
    const ports = Math.floor(Math.random() * 16);
    const cities = Math.floor(Math.random() * 16);
    const isTraitor = Math.random() < 0.5;
    const hasEmbargo = Math.random() < 0.1;
    const nukesSent = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 20) + 1;

    const player: Player = {
      name: `${prefix} ${suffixes.join(' ')}`,
      population: formattedPopulation,
      gold: formattedGold,
      area: area,
      ports: ports,
      cities: cities,
      isTraitor: isTraitor,
      hasEmbargo: hasEmbargo,
      nukesSent: nukesSent,
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
    return { ...event, message: event.message.replace('{player}', player.name) };
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
    setEvents((prevEvents) => [...prevEvents, parseEvent(randomEvent)]);
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

  
  React.useEffect(() => {
    generatePlayers();
  }, []);

  return (
    <div className="h-full w-full flex justify-between">
      <Image src="/ofimage.jpg" width={2000} height={2000} className="fixed top-0 left-0 h-full w-full scale-150 -z-10" alt="image" />
      <div className="relative z-10 p-4 w-1/5 flex flex-col justify-between gap-4 h-full">
        <UiWindow title="Player Rankings" childClass="max-h-[30vh]" className="w-full">
          <Table players={dummyPlayers} />
        </UiWindow>

        <PlayerStats />
      </div>
      <div className="flex flex-col w-1/4 justify-between items-center p-4 relative">
        <Requests requests={requests} onRequestsChange={(requests) => setRequests(requests)} />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full">
          { selectedPlayer && <PlayerInfoDialog player={selectedPlayer} open={selectedPlayer !== null} onClose={() => setSelectedPlayer(null)} />}
        </div>
      </div>
      <div className="w-1/4 justify-between flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4">
          <Button label="Show Player Dialog" onClick={selectRandomPlayer} />
          <Button label="Random Event" onClick={randomEvent} className="w-full bg-yellow-500 text-white" />
          <Button label="Alliance Request" onClick={sendAllianceRequest} className="w-full bg-green-500 text" />
          <Button label={intervalId ? "Stop Random Events" : "Start Random Events"} onClick={toggleRandomEvents} className="w-full bg-red-500 text-white" />
        </div>
        <UiWindow title="Event Log" childClass="max-h-[50vh] w-full py-2" background={false} className="flex-col-reverse text-black">
          <EventLog events={events} />
        </UiWindow>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import Table from '../components/Table';
import Button from '../components/Button';
import Requests from '../components/Requests';
import PlayerInfoDialog from '../components/PlayerInfoDialog';
import { Front, Game as GameInterface, Player } from '../interfaces/interfaces';
import Dialog from '../components/Dialog';
import PlayerStats from '../components/PlayerStats';
import Fronts from '../components/Fronts';
import EventLog from '../components/EventLog';
import { GameService } from '../services/GameService';


const Game: React.FC = () => {
    const [game, setGame] = React.useState<GameInterface | null>(null);
    const [gameService] = React.useState<GameService>(new GameService((game) => {
        console.log('game update')
        setGame((prevGame) => ({ ...prevGame, ...game }));
    }));

    const [showAllEvents, setShowAllEvents] = React.useState(false);

    const [currentPlayer, setCurrentPlayer] = React.useState<Player | null>(null)

    const [isActive, setIsActive] = React.useState(false);

    const handleSimulationToggle = () => {
        gameService.toggle();
        setIsActive(gameService.isActive);
    }

    const addPlayer = () => {
        gameService.addRandomPlayer();
    }

    const addFront = () => {
        gameService.addRandomFront();
    }

    const sendTroops = (front: Front, player: Player | null) => {
        gameService.sendTroops(front, player);
    }

    const addRandomEvent = () => {
        gameService.addRandomEvent();
    }

    const addAllianceRequest = () => {
        gameService.addAllianceRequest();
    }

    const selectRandomPlayer = () => {
        gameService.selectRandomPlayer();
    }

    const selectPlayer = (player: Player | null) => {
        gameService.selectPlayer(player);
    }

    const requestAlliance = (player: Player) => {
        gameService.sendAllianceRequest(player);
    }

    const toggleEvents = () => {
        setShowAllEvents(prevShowAll => !prevShowAll);
    };

    useEffect(() => {
        gameService.init();
    }, [gameService]);

    useEffect(() => {
        if (game) {
            const cp = gameService.getCurrentPlayer();
            if (cp) setCurrentPlayer(cp);
        }
    }, [gameService, game]);

    return (
        <div className='relative w-full h-full flex flex-col md:grid md:grid-rows-2 gap-1 md:gap-16'>
            <div className="h-max md:absolute max-w-full md:max-w-md w-full right-0 md:left-unset top-0 z-40 flex gap-4 items-end justify-end">
                <Dialog className='w-full min-w-full md:min-w-max' openLabel='Simulation controls' closeLabel='Hide controls'>
                    <div className='flex flex-col gap-1 p-1'>

                        <Button onClick={handleSimulationToggle} className={`${isActive ? 'bg-green-400' : 'bg-red-400'} col-span-2 py-4`} >
                            [{!isActive ? 'off' : 'on'}] Simulation
                        </Button>
                        <Button onClick={addPlayer} className='bg-yellow-400' >
                            Add random player
                        </Button>

                        <Button onClick={addFront} className='bg-yellow-400' >
                            Add random front
                        </Button>

                        <Button onClick={addRandomEvent} className='bg-yellow-400' label="addRandomEvent" />
                        <Button onClick={addAllianceRequest} className='bg-yellow-400' label="addAllianceRequest" />
                        <Button onClick={selectRandomPlayer} className='bg-yellow-400' label="selectRandomPlayer" />
                        {game && <span>Turn: {game.turn}</span>}
                    </div>
                </Dialog>
            </div>
            {(game && game.selectedPlayer) && <div className="absolute left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-full h-full z-20 flex justify-center items-center">
                {game.selectedPlayer && <PlayerInfoDialog className='max-w-sm min-w-sm !bg-gray-800/70 md:!bg-transparent' onRequestAlliance={requestAlliance} player={game.selectedPlayer} alliance={game.alliances.find(a => a.player.id == game.selectedPlayer?.id)} allianceRequest={game.requests.find(req => req.target.id == game.selectedPlayer?.id || req.sender.id == game.selectedPlayer?.id && req.type == 'alliance')} open={game.selectedPlayer !== null} onClose={() => selectPlayer(null)} />}
            </div>}
            {game &&
                <div className='relative w-full h-full md:justify-between flex flex-col md:grid grid-cols-[2fr_2fr_1fr] 2xl:grid-cols-[1fr_2fr_1fr] grid-rows-1 gap-4 overflow-hidden'>
                    <div id='container-top-left' className="md:h-full w-full flex flex-col gap-2">
                        <Dialog openLabel='Leaderboard' closeLabel='Collapse'>
                            <Table players={game.players} alliances={game.alliances} currentPlayerID={gameService.getCurrentPlayer()?.id} className='max-h-full' />
                        </Dialog>
                        <button onClick={toggleEvents} className='absolute md:hidden right-0 top-0 theme-container p-2 px-4'>{showAllEvents ? 'Hide events' : 'All events'}</button>
                        <div className='md:hidden'>
                            <EventLog className='max-h-[30vh] md:max-h-[40vh] h-full w-full' events={game.events} newEvents={game.newEvents} showAll={showAllEvents} />
                        </div>
                    </div>

                    <div id='container-top-middle' className="absolute w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[unset]  md:h-1/2">
                        <Requests requests={game.requests.filter(req => !req.isRejected && req.target.id == gameService.getCurrentPlayer()?.id)} />
                    </div>

                    <div id='container-top-right' className="md:h-full w-full">
                        <div className='w-full gap-4 grid grid-cols-2 p-4'>

                        </div>
                    </div>
                </div>}
            {game &&
                <div className="relative w-full h-full flex flex-col md:grid grid-cols-1 md:grid-cols-3 md:portrait:max-h-[30vh] md:portrait:grid-cols-2 md:portrait:grid-rows-2 md:portrait:self-end landscape:2xl:grid-cols-[2fr_2fr_1fr] md:gap-4 gap-2 justify-end md:items-end overflow-hidden">
                    <div id="container-bottom-left" className="overflow-hidden max-h-max h-full w-full flex md:gap-4 gap-2 items-end overflow-hidden md:order-1 order-3 md:portrait:row-span-2">
                        {currentPlayer && <PlayerStats player={currentPlayer} />}
                    </div>

                    <div id="container-bottom-middle" className="overflow-hidden md:h-1/2 md:portrait:h-max flex flex-col justify-end order-2">
                        <Fronts fronts={game.fronts} className='h-full' onSendTroops={sendTroops} />
                        {/* <GridComponent /> */}
                    </div>

                    <div id="container-bottom-right" className="overflow-hidden hidden md:flex md:flex-col md:h-full w-full justify-end items-end order-1 md:order-3 gap-2">
                        <EventLog className='max-h-[40vh] w-full' events={game.events} newEvents={game.newEvents} showAll={showAllEvents} />
                        <button onClick={toggleEvents} className='hidden md:flex theme-container p-2 px-4 w-max mx-4 text-xs cursor-pointer'>{showAllEvents ? 'Hide events' : 'All events'}</button>
                    </div>
                </div>}
        </div>
    );
};

export default Game;

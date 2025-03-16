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

    useEffect(() => {
        gameService.init();
    }, [gameService]);

    useEffect(() => {
        if(game) {
            const cp = gameService.getCurrentPlayer();
            if(cp) setCurrentPlayer(cp);
        }
    }, [gameService, game]);

    return (
        <div className='relative w-full h-full grid grid-rows-2 gap-16'>
            <div className="absolute max-w-md w-full right-4 top-4 z-40 grid grid-cols-2 gap-4">
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
            {(game && game.selectedPlayer) && <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full z-20 flex justify-center items-center">
                {game.selectedPlayer && <PlayerInfoDialog onRequestAlliance={requestAlliance} player={game.selectedPlayer} alliance={game.alliances.find(a => a.player.id == game.selectedPlayer?.id)} allianceRequest={game.requests.find(req => req.target.id == game.selectedPlayer?.id || req.sender.id == game.selectedPlayer?.id && req.type == 'alliance')} open={game.selectedPlayer !== null} onClose={() => selectPlayer(null)} />}
            </div>}
            {game &&
                <div className='relative w-full h-full justify-between grid grid-cols-[1fr_2fr_1fr] grid-rows-1 gap-4 overflow-hidden'>
                    <div id='container-top-left' className="h-full w-full">
                        <Dialog>
                            <Table players={game.players} alliances={game.alliances} currentPlayerID={gameService.getCurrentPlayer()?.id} className='max-h-full' />
                        </Dialog>
                    </div>

                    <div id='container-top-middle' className="h-1/2">
                        <Requests requests={game.requests.filter(req => !req.isRejected && req.target.id == gameService.getCurrentPlayer()?.id)} />
                    </div>

                    <div id='container-top-right' className="h-full w-full">
                        <div className='w-full gap-4 grid grid-cols-2 p-4'>

                        </div>
                    </div>
                </div>}
            {game &&
                <div className="relative w-full h-full justify-between grid grid-cols-3 grid-cols-[2fr_2fr_1fr] gap-4 items-end overflow-hidden">
                    <div id="container-bottom-left" className="overflow-hidden h-full w-full flex gap-4 items-end overflow-hidden">
                        {currentPlayer && <PlayerStats player={currentPlayer} />}
                    </div>

                    <div id="container-bottom-middle" className="overflow-hidden h-1/2 flex flex-col justify-end">
                        <Fronts fronts={game.fronts} className='h-full' onSendTroops={sendTroops} />
                        {/* <GridComponent /> */}
                    </div>

                    <div id="container-bottom-right" className="overflow-hidden h-full w-full flex items-end">
                        <EventLog className='max-h-[40vh] w-full' events={game.events} newEvents={game.newEvents} showAll={false} />
                    </div>
                </div>}
        </div>
    );
};

export default Game;

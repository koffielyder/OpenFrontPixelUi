import React from 'react';
import UiWindow from './UiWindow';
import Button from './Button';
import Image from 'next/image';
import { Player } from '../page';


interface PlayerInfoDialogProps {
    open: boolean;
    onClose: () => void;
    player: Player;
}

const PlayerInfoDialog: React.FC<PlayerInfoDialogProps> = ({ open, onClose, player }) => {
    return (
        <UiWindow title={player.name} hidable={false} closable={true} isOpen={open} onClose={onClose}>
        <div className="flex flex-col gap-1 bg-gray-600 pb-1">
          <div className="p-4 flex flex-col gap-4">
            <Button label="Request Alliance" onClick={() => {}} className="w-full bg-green-500 text-white py-6" tooltip="Request an alliance with the selected player" />
            <div className="flex w-full gap-4">
              <Button onClick={() => {}} className="w-full bg-yellow-500 text-white py-6 justify-center flex" tooltip='Tell allies to target selected player'>
                <Image src="/images/TargetIconWhite.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
              </Button>
              <Button onClick={() => {}} className="w-full bg-blue-500 text-white py-6 justify-center flex" tooltip='Send emoji to player'>
                <Image src="/images/EmojiIconWhite.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center p-4 bg-gray-500">
            <div className="pixel-shadow bg-purple-600 p-2 flex flex-col shadow-purple-900 gap-1 items-center" title="Current population of player">
              <div className="h-8 flex items-center justify-center">
                <span>Pop</span>
              </div>
              <div className="bg-purple-400 shadow-purple-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
              <span>{player.population}</span>
            </div>
            <div className="pixel-shadow bg-yellow-600 p-2 flex flex-col shadow-yellow-900 gap-1 items-center" title="Current gold of player">
              <div className="h-8 flex items-center justify-center">
                <Image src="/images/GoldCoinIcon.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
              </div>
              <div className="bg-yellow-400 shadow-yellow-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
              <span>{player.gold}</span>
            </div>
            <div className="pixel-shadow bg-blue-600 p-2 flex flex-col shadow-blue-900 gap-1 items-center" title="Amount of ports owned">
              <div className="h-8 flex items-center justify-center">
                <Image src="/images/PortIcon.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
              </div>
              <div className="bg-blue-400 shadow-blue-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
              <span>{player.ports}</span>
            </div>
            <div className="pixel-shadow bg-green-600 p-2 flex flex-col shadow-green-900 gap-1 items-center" title="Amount of cities owned">
              <div className="h-8 flex items-center justify-center">
                <Image src="/images/CityIconWhite.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
              </div>
              <div className="bg-green-400 shadow-green-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
              <span>{player.cities}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center p-4 bg-red-900">
            <div className={`pixel-shadow bg-red-600 p-2 flex flex-col shadow-red-900 gap-1 items-center ${player.isTraitor ? '' : 'opacity-50'}`} title="Did the player break an alliance">
              <div className="h-8 flex items-center justify-center">
                <Image src="/images/TraitorIconWhite.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
              </div>
              <div className={`bg-red-400 shadow-red-200 w-full h-[2px] pixel-shadow-small`}></div>
              <span>{player.isTraitor ? 'Yes' : 'No'}</span>
            </div>
            <div className={`pixel-shadow bg-yellow-600 p-2 flex flex-col shadow-yellow-900 gap-1 items-center ${player.hasEmbargo ? '' : 'opacity-30'}`} title='Is there an embargo in effect'>
              <div className="h-8 flex items-center justify-center">
                <Image src="/images/DisabledIcon.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
              </div>
              <div className="bg-yellow-400 shadow-yellow-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
              <span>{player.hasEmbargo ? 'Yes' : 'No'}</span>
            </div>
            <div className={`pixel-shadow bg-blue-600 p-2 flex flex-col shadow-blue-900 gap-1 items-center ${player.nukesSent ? '' : 'opacity-50'}`} title='Amount of nukes this player sent to you'>
              <div className="h-8 flex items-center justify-center">
                <Image src="/images/MIRVIcon.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
              </div>
              <div className="bg-blue-400 shadow-blue-200 w-full h-[2px] pixel-shadow-small opacity-30"></div>
              <span>{player.nukesSent}</span>
            </div>
          </div>
        </div>


      </UiWindow>
    );
};

export default PlayerInfoDialog;
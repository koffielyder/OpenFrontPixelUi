import React, { useEffect } from 'react';
import UiWindow from './UiWindow';
import Button from './Button';
import Image from 'next/image';
import { Player } from '../interfaces/interfaces';
import { formatNumber } from '../utils/NumberFormatter';


interface PlayerInfoDialogProps {
  open: boolean;
  onClose: () => void;
  player: Player;
  onChange?: () => void;
  className?: string;
}



const PlayerInfoDialog: React.FC<PlayerInfoDialogProps> = ({ open, onClose, player, className = "" }) => {
  const [alliance, setAlliance] = React.useState(player.alliance);

  const requestAlliance = () => {
    if (player.alliance) {
      player.alliance.pending = true;
    } else {
      player.alliance = { isAlly: false, pending: true, level: 1, gold: 0 };
    }
    setAlliance({ ...player.alliance });

    setTimeout(() => {
      if (player.alliance) {

        if (Math.random() > 0.1) {
          player.alliance.isAlly = true;
          player.alliance.pending = false;
          player.alliance.isRejected = 0;
          setAlliance({ ...player.alliance });
        } else {
          player.alliance.isAlly = false;
          player.alliance.pending = false;
          player.alliance.isRejected = 5000;
          setAlliance({ ...player.alliance });
          setTimeout(() => {
            if (player.alliance) {
              player.alliance.isRejected = 0;
              setAlliance({ ...player.alliance });
            };

          }, player.alliance.isRejected);
        }
      }
    }, 2000);
  };

  useEffect(() => {
    setAlliance(player.alliance);
  }, [player]);

  return (
    <UiWindow title={player.name} hidable={false} closable={true} isOpen={open} onClose={onClose} className={`bg-transparent ${className}`}>
      <div className="flex flex-col gap-2">
        {alliance?.isAlly ?
          <div className="flex flex-col bg-green-900/60">
            <div className="flex items-center pt-4 pl-4">
              <span>Alliance</span>
            </div>
            <div className="flex flex-col p-4 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className='theme-stat-box-vertical !from-green-800/60'>
                  <div className='flex flex-col items-center text-center'>
                    <span>Level</span>
                  </div>
                  <span className="bg-white w-[1px] opacity-30 h-3/4 mx-auto"></span>
                  <span>{alliance.level}</span>
                </div>
                <div className='theme-stat-box-vertical !from-yellow-900/60'>
                  <div className='flex flex-col items-center text-center'>
                    <span>Expires</span>
                  </div>
                  <span className="bg-white w-[1px] opacity-30 h-3/4 mx-auto"></span>
                  <span>{alliance.expires}</span>
                </div>
              </div>
              <div className="flex w-full gap-4">
                <Button onClick={() => { }} className="w-full bg-blue-500 text-white py-4 justify-center flex" tooltip='Request troops from ally'>
                  <div className="flex items-center gap-1">
                    <Image src="/images/Aid.svg" width={30} height={30} className="color-white text-white" alt="Alliance Icon" />
                  </div>
                </Button>
                <Button onClick={() => { }} className="w-full bg-cyan-500 text-white py-4 justify-center flex" tooltip='Send troops to ally'>
                  <div className="flex items-center gap-1">
                    <Image src="/images/troopsRunning.svg" width={30} height={30} className="color-white text-white !fill-white stroke-white" alt="Troops ruunning Icon" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
          :
            <div className="flex flex-col p-4 bg-gray-900/60">
            {!alliance?.pending && !Boolean(alliance?.isRejected) && (
              <Button label="Request Alliance" onClick={requestAlliance} className="w-full bg-green-500 text-white py-6" tooltip="Request an alliance with the selected player" />
            )}
            {alliance?.pending && (
              <Button label="Pending Request" onClick={() => { }} className="w-full bg-green-500 text-white py-6 disabled" tooltip="Request is pending" />
            )}
            {Boolean(alliance?.isRejected) && (
              <Button label="Alliance Rejected" onClick={() => { }} className="w-full !bg-red-500 text-white py-6 disabled" tooltip="Request was rejected" />
            )}
            </div>
        }


        <div className="gap-4 w-full grid grid-cols-4 p-4 bg-gray-900/20">
          <div className='theme-stat-box !from-cyan-900/60'>
            <div className='flex flex-col items-center text-center'>
              <span>Pop</span>
            </div>
            <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
            <div className='flex flex-col items-center'>
              <span className=''>{formatNumber(player.population)}</span>
            </div>
          </div>
          <div className='theme-stat-box !from-yellow-900/60'>
            <div className='flex flex-col items-center text-center'>
              <span>Gold</span>
            </div>
            <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
            <span>{formatNumber(player.gold)}</span>
          </div>
          <div className={`theme-stat-box !from-blue-900/60 ${!player.ports && 'opacity-50'}`}>
            <span>Ports</span>
            <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
            <span>{player.ports}</span>
          </div>
          <div className={`theme-stat-box !from-green-900/60 ${!player.cities && 'opacity-50'}`}>
            <span>Cities</span>
            <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
            <span>{player.cities}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center p-4 bg-red-900/50">
          <div className={`theme-stat-box !from-red-900/60 ${!player.isTraitor && 'opacity-50'}`}>
            <div className="h-8 flex items-center justify-center">
              <Image src="/images/TraitorIconWhite.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
            </div>
            <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
            <span>{player.isTraitor ? 'Yes' : 'No'}</span>
          </div>
          <div className={`theme-stat-box !from-yellow-400/30 ${!player.hasEmbargo && 'opacity-50'}`}>
            <div className="h-8 flex items-center justify-center">
              <Image src="/images/DisabledIcon.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
            </div>
            <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
            <span>{player.hasEmbargo ? 'Yes' : 'No'}</span>
          </div>

          <div className={`theme-stat-box !from-blue-400/30 ${!player.nukesSent && 'opacity-50'}`}>
            <div className="h-8 flex items-center justify-center">
              <Image src="/images/MissileSiloIconWhite.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
            </div>
            <span className="bg-white h-[1px] opacity-30 w-3/4 mx-auto"></span>
            <span>{player.nukesSent}</span>
          </div>
        </div>

        
        <div className="p-4 flex flex-col gap-4 bg-gray-900/60">
          <div className="flex w-full gap-4">
            <Button onClick={() => { }} className="w-full bg-yellow-500 text-white py-3 justify-center flex" tooltip='Tell allies to target selected player'>
              <Image src="/images/TargetIconWhite.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
            </Button>
            <Button onClick={() => { }} className="w-full bg-blue-500 text-white py-3 justify-center flex" tooltip='Send emoji to player'>
              <Image src="/images/EmojiIconWhite.svg" width={24} height={24} className="color-white text-white" alt="Alliance Icon" />
            </Button>
          </div>
        </div>
      </div>


    </UiWindow>
  );
};

export default PlayerInfoDialog;
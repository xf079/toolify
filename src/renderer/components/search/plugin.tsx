import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CloseIcon from '@/assets/icon/close-icon.svg?react';

export interface ISearchPluginProps {
  plugin: IPlugin;
  onClose: () => void;
}
export const SearchPlugin: FC<ISearchPluginProps> = ({ plugin, onClose }) => {
  return (
    <div className='flex flex-row justify-center items-center gap-1.5 rounded bg-gray-100 pl-3 pr-1 py-2.5'>
      <Avatar className='w-5 h-5 rounded-none'>
        <AvatarImage src={plugin.logo} alt='@shadcn' />
        <AvatarFallback>{plugin.name}</AvatarFallback>
      </Avatar>
      <span className='text-gray-700 font-semibold text-sm'>{plugin.name}</span>
      <div
        className='w-6 h-6 rounded-xl flex flex-row justify-center items-center hover:bg-gray-300 cursor-pointer transition-all'
        onClick={onClose}
      >
        <CloseIcon className='w-4 h-4 text-gray-700' />
      </div>
    </div>
  );
};

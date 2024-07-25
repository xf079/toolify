import { FC } from 'react';
import { clsx } from 'clsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface ISearchItemProps {
  item: IPlugin;
  active: boolean;
  onOpenPlugin: (item: IPlugin) => void;
}

export const SearchItem: FC<ISearchItemProps> = ({
  item,
  active,
  onOpenPlugin
}) => {
  return (
    <div
      className={clsx('item', active ? 'active' : '')}
      onClick={() => onOpenPlugin(item)}
    >
      <div className='flex flex-row justify-start items-center gap-2'>
        <Avatar className='w-5 h-5 rounded-none'>
          <AvatarImage src={item.logo} alt='@shadcn' />
          <AvatarFallback>{item.name}</AvatarFallback>
        </Avatar>
        <div
          className='title'
          dangerouslySetInnerHTML={{ __html: item.nameFormat }}
        />
      </div>
      <span className='desc'>
        {item.type === 'app' ? '' : item.desc}
      </span>
    </div>
  );
};

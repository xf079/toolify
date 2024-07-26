import { FC } from 'react';
import { clsx } from 'clsx';
import { ArrowTopRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
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
        {item.type === 'more' ? (
          <>
            <div className='w-5 h-5 flex flex-row items-center justify-center'>
              <DotsHorizontalIcon />
            </div>
            <div className='title'>{item.name}</div>
          </>
        ) : (
          <>
            <Avatar className='w-5 h-5 rounded-none'>
              <AvatarImage src={item.logo} alt='@shadcn' />
              <AvatarFallback>{item.name}</AvatarFallback>
            </Avatar>
            <div
              className='title'
              dangerouslySetInnerHTML={{ __html: item.nameFormat }}
            />
          </>
        )}
      </div>
      <span className='desc'>
        {item.type === 'more' ? <ArrowTopRightIcon /> : null}
        {item.type === 'app' ? '' : item.desc}
      </span>
    </div>
  );
};

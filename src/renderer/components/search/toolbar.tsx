import { Button } from '@/components/ui/button';
import { GearIcon } from '@radix-ui/react-icons';
import { forwardRef } from 'react';

export interface SearchToolbarProps {}

export const SearchToolbar = forwardRef<HTMLDivElement, SearchToolbarProps>(
  (props, ref) => {
    return (
      <div
        className='flex flex-row justify-between items-center px-3 py-2'
        ref={ref}
      >
        <Button variant='ghost'>
          <GearIcon />
        </Button>
        <div className='flex flex-row justify-center items-center gap-2'>
          <Button variant='ghost' size='sm' className='gap-1'>
            <span className='font-light text-xs text-gray-500'>语音输入</span>
            <kbd className='shortcut'>空格</kbd>
          </Button>
          <div className='flex flex-row gap-1 items-center'>
            <span className='font-light text-xs text-gray-400'>切换</span>
            <kbd className='shortcut'>↑</kbd>
            <kbd className='shortcut'>↓</kbd>
          </div>
          <div className='flex flex-row gap-1 ml-1 items-center'>
            <span className='font-light text-xs text-gray-400'>选中</span>
            <kbd className='shortcut'>↵</kbd>
          </div>
        </div>
      </div>
    );
  }
);

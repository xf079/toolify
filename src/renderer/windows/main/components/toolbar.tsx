import { forwardRef } from 'react';
import { Button, Segmented } from 'antd';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';

export interface SearchToolbarProps {}

export const SearchToolbar = forwardRef<HTMLDivElement, SearchToolbarProps>(
  (props, ref) => {
    const { styles } = useGlobalStyles();

    return (
      <div
        className='flex flex-row justify-between items-center px-3 py-2'
        ref={ref}
      >
        <Segmented<string>
          size='small'
          options={['System', 'Dark', 'Light']}
          onChange={(value) => {
            console.log(value); // string
          }}
        />
        <div className='flex flex-row justify-center items-center gap-2'>
          <Button type='text' shape='round' size='middle'>
            <span className='font-light text-xs text-gray-500'>语音输入</span>
            <kbd className={styles.kbd}>Space</kbd>
          </Button>
          <div className='flex flex-row gap-1 items-center'>
            <span className='font-light text-xs text-gray-400'>切换</span>
            <kbd className={styles.kbd}>↑</kbd>
            <kbd className={styles.kbd}>↓</kbd>
          </div>
          <div className='flex flex-row gap-1 ml-1 items-center'>
            <span className='font-light text-xs text-gray-400'>选中</span>
            <kbd className={styles.kbd}>↵</kbd>
          </div>
        </div>
      </div>
    );
  }
);

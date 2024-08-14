import { forwardRef, HTMLAttributes } from 'react';
import { Button, Segmented } from 'antd';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';
import { createStyles } from 'antd-style';
import { WINDOW_TOOLBAR_HEIGHT } from '@config/constants';

export interface SearchToolbarProps extends HTMLAttributes<HTMLDivElement> {}

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    height: ${WINDOW_TOOLBAR_HEIGHT}px;
  `
}));

export const SearchToolbar = forwardRef<HTMLDivElement, SearchToolbarProps>(
  (props, ref) => {
    const { styles } = useGlobalStyles();
    const { styles: styles2, cx } = useStyles();

    return (
      <div
        {...props}
        className={cx(
          styles2.container,
          'flex flex-row justify-between items-center px-3 shrink-0 overflow-hidden'
        )}
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

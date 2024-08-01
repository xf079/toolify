import { forwardRef } from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import {
  BgColorsOutlined,
  GlobalOutlined,
  GooglePlusOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useGlobalStyles } from '@/hooks/useGlobalStyles';

export interface SearchToolbarProps {}

export const SearchToolbar = forwardRef<HTMLDivElement, SearchToolbarProps>(
  (props, ref) => {
    const { styles } = useGlobalStyles();

    const items: MenuProps['items'] = [
      {
        key: '1',
        label: '主题设置',
        icon: <BgColorsOutlined />,
        children: [
          {
            key: '1-1',
            label: '跟随系统'
          },
          {
            key: '1-2',
            label: '暗黑模式'
          },
          {
            key: '1-3',
            label: '亮色模式'
          }
        ]
      },
      {
        key: '4',
        label: '语言设置',
        icon: <GlobalOutlined />,
        children: [
          {
            key: '4-1',
            label: '跟随系统'
          },
          {
            key: '4-2',
            label: '简体中文'
          },
          {
            key: '4-3',
            label: 'English'
          }
        ]
      },
      {
        key: '2',
        icon: <GooglePlusOutlined />,
        label: '插件中心'
      },
      {
        key: '3',
        icon: <UserOutlined />,
        label: '个人中心'
      }
    ];

    return (
      <div
        className='flex flex-row justify-between items-center px-3 py-2'
        ref={ref}
      >
        <Dropdown menu={{ items }} placement='topLeft'>
          <Button type='text' shape='circle' size='middle'>
            <SettingOutlined />
          </Button>
        </Dropdown>
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

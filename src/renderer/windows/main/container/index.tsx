import { useRef, useState } from 'react';
import { useMemoizedFn, useMount } from 'ahooks';
import { Avatar, Button, Flex, Typography } from 'antd';
import {
  CloseOutlined,
  HolderOutlined,
  AudioOutlined
} from '@ant-design/icons';
import useSettings from '@/store';
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';
import { useContainerHeight } from '../hooks/useContainerHeight';
import { useScrollViewport } from '../hooks/useScrollViewport';
import { usePluginManager } from '../hooks/usePluginManager';
import { SearchItem } from '../components/item';
import { SearchToolbar } from '../components/toolbar';

import LogoIcon from '../assets/logo.svg?react';
import pinedIcon from '../assets/icon/pined.png?url';

import { useStyles } from './styles';

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

const Container = () => {
  const { styles, cx } = useStyles();
  const { setting } = useSettings();
  const bsRef = useRef<BScroll>();
  const inputRef = useRef();
  const scrollRef = useRef<HTMLDivElement>();
  const listRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const {
    value,
    index,
    focus,
    plugin,
    plugins,
    pluginLoading,
    setIndex,
    setFocus,
    onChange,
    onValueKeyDown,
    onOpenPlugin,
    onClosePlugin
  } = usePluginManager();

  useContainerHeight({
    listRef,
    onChange: (val) => {
      console.log(val);
      setContainerHeight(val);
      setTimeout(() => {
        bsRef.current?.refresh();
      }, 800);
    }
  });

  useScrollViewport({
    wrapper: scrollRef,
    viewportHeight: containerHeight,
    index,
    setIndex
  });

  const onPluginContextMenu = async () => {
    console.log(pinedIcon);

    // toolify.showOpenMenu([
    //   {
    //     label: '固定到搜索面板',
    //     icon: remote.nativeImage.createFromBuffer(
    //       remote.nativeImage.createFromDataURL(pinedIcon).toBitmap(),
    //       {
    //         width: 16,
    //         height: 16
    //       }
    //     )
    //   }
    // ]);
  };

  const initContainerScroll = () => {
    bsRef.current = new BScroll('.main-container', {
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 100,
        dampingFactor: 0.1
      },
      scrollY: true,
      scrollbar: {
        interactive: true
      },
      bounce: false,
      momentum: false
    });

    bsRef.current?.on('scroll', () => {
      console.log('ok');
    });
  };

  const onOpenMenu = useMemoizedFn(() => {
    // eventApi.send('main:openPluginMenu');
  });

  const onOpenPluginCenter = () => {
    // eventApi.send('main:openSystemPlugin', { type: SYSTEM_PLUGIN_CENTER });
  };

  useMount(() => {
    initContainerScroll();
  });

  return (
    <div className={cx(styles.search, 'flex flex-col')}>
      <Flex
        className={cx(styles.wrapper, 'px-3 gap-3 shrink-0')}
        justify='space-between'
        align='center'
      >
        {plugin ? (
          <Flex
            justify='center'
            align='center'
            className={cx(styles.plugin, 'gap-1.5 pl-2 pr-2 py-2')}
          >
            <Avatar src={plugin.logo} size='small' />
            <Typography.Text className='font-medium'>
              {plugin.name}
            </Typography.Text>
            <Flex
              className={cx(
                styles.close,
                'w-6 h-6 rounded-xl cursor-pointer transition-all'
              )}
              justify='center'
              align='center'
              onClick={onClosePlugin}
            >
              <CloseOutlined className='text-sm opacity-50' />
            </Flex>
          </Flex>
        ) : (
          <Flex
            className={cx(styles.logo, pluginLoading ? 'loading' : '')}
            justify='center'
            align='center'
            onClick={onOpenPluginCenter}
          >
            <LogoIcon className='w-6 h-6 ' />
          </Flex>
        )}
        <Flex
          vertical
          align='center'
          justify='center'
          className='flex-1 h-full'
        >
          <input
            ref={inputRef}
            value={value}
            autoFocus
            onChange={onChange}
            className={cx(
              styles.input,
              focus ? 'focus' : '',
              'w-full h-[54px]'
            )}
            placeholder={setting.placeholder}
            onKeyDown={onValueKeyDown}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
          />
        </Flex>
        {plugin ? (
          <Button
            type='text'
            shape='circle'
            icon={<HolderOutlined className='text-[24px]' />}
            onClick={onOpenMenu}
          />
        ) : (
          <Button
            type='text'
            shape='circle'
            icon={<AudioOutlined className='h-6 w-6' />}
            onClick={onOpenMenu}
          />
        )}
      </Flex>
      <div
        className='main-container w-full relative shrink-0 overflow-hidden'
        style={{ height: containerHeight }}
        ref={scrollRef}
      >
        <div className='px-2 gap-1 content' ref={listRef}>
          {plugins.map((group) => (
            <Flex vertical key={group.type} gap={2}>
              <Typography.Text
                type='secondary'
                className={cx(styles.groupTitle, 'px-3 pb-1 pt-2')}
              >
                {group.label}
              </Typography.Text>
              {group.children.map((item) => (
                <SearchItem
                  key={item.index}
                  type={group.type}
                  item={item}
                  active={item.index === index}
                  onContextMenu={onPluginContextMenu}
                  onOpenPlugin={onOpenPlugin}
                />
              ))}
            </Flex>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Container;

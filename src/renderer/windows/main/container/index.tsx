import { useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import { Avatar, Button, Flex, Typography } from 'antd';
import {
  CloseOutlined,
  HolderOutlined,
  AudioOutlined
} from '@ant-design/icons';
import useSettings from '@/store';
import { SYSTEM_PLUGIN_CENTER } from '@config/constants';
import { useSearchWrapperRect } from '../hooks/useSearchWrapperRect';
import { useSearchScrollViewport } from '../hooks/useSearchScrollViewport';
import { usePluginManager } from '../hooks/usePluginManager';

import { SearchItem } from '../components/item';
import { SearchToolbar } from '../components/toolbar';

import LogoIcon from '../assets/logo.svg?react';

import { useStyles } from './styles';

const Container = () => {
  const { styles, cx } = useStyles();
  const { setting } = useSettings();
  const inputRef = useRef();
  const scrollRef = useRef<HTMLDivElement>();

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

  const { listRef, toolbarRef, listHeight } = useSearchWrapperRect();

  useSearchScrollViewport({
    wrapper: scrollRef,
    viewportHeight: listHeight,
    index,
    setIndex
  });

  const onOpenMenu = useMemoizedFn(() => {
    eventApi.send('main:openPluginMenu');
  });

  const onOpenPluginCenter = () => {
    eventApi.send('main:openSystemPlugin', { type: SYSTEM_PLUGIN_CENTER });
  };

  return (
    <div className={styles.search}>
      <Flex
        className={cx(styles.wrapper, 'px-3 gap-3')}
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
        className='w-full overflow-y-auto'
        style={{ height: listHeight }}
        ref={scrollRef}
      >
        <Flex vertical className='p-2 gap-1' ref={listRef}>
          {plugins.map((group) => (
            <Flex vertical key={group.type} gap={2}>
              <Typography.Text
                type='secondary'
                className={cx(styles.groupTitle, 'px-3 mb-1')}
              >
                {group.label}
              </Typography.Text>
              {group.children.map((item) => (
                <SearchItem
                  key={item.id}
                  item={item}
                  active={item.index === index}
                  onOpenPlugin={onOpenPlugin}
                />
              ))}
            </Flex>
          ))}
        </Flex>
      </div>
      <SearchToolbar ref={toolbarRef} />
    </div>
  );
};

export default Container;

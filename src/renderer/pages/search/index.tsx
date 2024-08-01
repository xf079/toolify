import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useEventTarget, useMemoizedFn, useUpdateEffect } from 'ahooks';
import {
  MAIN_OPEN_PLUGIN_MENU,
  MAIN_PLUGIN_CLOSE,
  MAIN_PLUGIN_OPEN,
  MAIN_SEARCH
} from '@main/config/constants';
import { SearchItem } from '@/components/search/item';
import { SearchToolbar } from '@/components/search/toolbar';

import { useSearchWrapperRect } from '@/hooks/useSearchWrapperRect';
import { useSearchScrollViewport } from '@/hooks/useSearchScrollViewport';
import { generateGroupIndex, generatePluginGroup } from '@/utils/pluginHandler';
import { useConfig } from '@/context';
import { Avatar, Button, Flex, Typography } from 'antd';
import { CloseOutlined, HolderOutlined } from '@ant-design/icons';
import { useStyles } from './styles';

import MicrophoneIcon from '@/assets/icon/microphone-icon.svg?react';
import LogoIcon from '@/assets/logo.svg?react';

const Search = () => {
  const { styles, cx } = useStyles();

  const config = useConfig();
  const inputRef = useRef();
  const scrollRef = useRef<HTMLDivElement>();

  const [value, { reset, onChange }] = useEventTarget({ initialValue: '' });
  const [groupList, setGroupList] = useState<IGroupType[]>([]);
  const [index, setIndex] = useState(1);
  const [plugin, setPlugin] = useState<IPlugin>();

  const { listRef, toolbarRef, listHeight } = useSearchWrapperRect();

  const maxIndex = useMemo(() => {
    if (!groupList.length) return 0;
    const lastGroup = groupList[groupList.length - 1];
    const childList = lastGroup.children.length;
    return lastGroup.children[childList - 1].index;
  }, [groupList]);

  const pluginList = useMemo(() => {
    return groupList.reduce(
      (accumulator, currentValue) => accumulator.concat(currentValue.children),
      []
    );
  }, [groupList]);

  const onKeyDown = useMemoizedFn((event: KeyboardEvent) => {
    if (event.code === 'Backspace') {
      if (!value && plugin) {
        event.preventDefault();
        void onClosePlugin();
      }
    }
    if (event.code === 'ArrowDown') {
      event.preventDefault();
      const nextNum = index + 1;
      setIndex(nextNum > maxIndex ? 1 : nextNum);
    }
    if (event.code === 'ArrowUp') {
      event.preventDefault();
      const nextNum = index - 1;
      setIndex(nextNum < 1 ? maxIndex : nextNum);
    }
    if (event.code === 'Enter') {
      event.preventDefault();
      const _plugin = pluginList.find((item) => item.index === index);
      if (_plugin) {
        void onOpenPlugin(_plugin);
      }
    }
  });

  /**
   * 打开插件
   */
  const onOpenPlugin = useMemoizedFn(async (item: IPlugin) => {
    /**
     * 展开更多处理
     */
    if (item.type === 'more') {
      setGroupList((prevState) => {
        const _state = prevState.map((group) => {
          if (item.main === group.type) {
            const hasShowAll = !group.showDisplayed;
            const children = hasShowAll
              ? group.origin
              : group.origin.slice(0, group.maxDisplayedNumber);
            return {
              ...group,
              showDisplayed: hasShowAll,
              children: children
            };
          }
          return group;
        });

        return generateGroupIndex(_state);
      });
      return;
    }
    if (item.type !== 'app') {
      setPlugin(item);
    }
    reset();
    setGroupList([]);
    await apeak.sendSync(MAIN_PLUGIN_OPEN, item);
  });

  /**
   * 关闭当前插件
   */
  const onClosePlugin = useMemoizedFn((event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    onReset();
    setPlugin(undefined);
    apeak.send(MAIN_PLUGIN_CLOSE);
  });

  /**
   * 初始化
   */
  const onReset = useMemoizedFn(() => {
    setGroupList([]);
    setIndex(1);
    reset();
  });

  const onOpenMenu = useMemoizedFn(() => {
    apeak.send(MAIN_OPEN_PLUGIN_MENU);
  });

  useSearchScrollViewport({
    wrapper: scrollRef,
    viewportHeight: listHeight,
    index,
    setIndex
  });

  useUpdateEffect(() => {
    if (!value) {
      setGroupList([]);
      return;
    }
    if (plugin) {
      console.log('通知到插件');
      return;
    }
    apeak.sendSync(MAIN_SEARCH, value).then((data) => {
      setGroupList(generatePluginGroup(data));
    });
  }, [value]);

  useEffect(() => {
    // apeak.on(MAIN_HIDE, () => {
    //   onReset();
    // });
    // apeak.on(MAIN_SEARCH_FOCUS, () => {
    //   // inputRef.current?.focus();
    // });
    // apeak.on(MAIN_SYNC_PLUGIN, (_, data) => {
    //   setCurrentPlugin(data);
    // });
  }, []);

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
            <Typography.Text className='font-light'>
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
          <Flex className={styles.logo} justify='center' align='center'>
            <LogoIcon className='w-7 h-7' />
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
            className={cx(styles.input,'w-full h-[54px]')}
            placeholder={config.placeholder}
            onKeyDown={onKeyDown}
            // onBlur={onBlur}
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
            icon={<MicrophoneIcon className='h-6 w-6' />}
            onClick={onOpenMenu}
          />
        )}
      </Flex>
      <div className='result'>
        <div
          className='w-full overflow-y-auto'
          style={{ height: listHeight }}
          ref={scrollRef}
        >
          <Flex vertical className='p-2 gap-1' ref={listRef}>
            {groupList.map((group) => (
              <Flex vertical key={group.type}>
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
    </div>
  );
};

export default Search;

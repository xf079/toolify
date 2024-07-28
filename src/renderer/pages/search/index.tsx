import { Button } from '@/components/ui/button';
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useEventTarget, useMemoizedFn, useUpdateEffect } from 'ahooks';
import {
  MAIN_OPEN_PLUGIN_MENU,
  MAIN_PLUGIN_CLOSE,
  MAIN_PLUGIN_OPEN,
  MAIN_SEARCH
} from '@main/config/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/search/logo';
import { SearchItem } from '@/components/search/item';
import { SearchToolbar } from '@/components/search/toolbar';
import { SearchPlugin } from '@/components/search/plugin';

import { useSearchWrapperRect } from '@/hooks/useSearchWrapperRect';
import { useSearchScrollViewport } from '@/hooks/useSearchScrollViewport';
import { generateGroupIndex, generatePluginGroup } from '@/utils/pluginHandler';

import MicrophoneIcon from '@/assets/icon/microphone-icon.svg?react';

import './search.css';

const Search = () => {
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
    if(item.type !== 'app'){
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
    <div className='search'>
      <div className='search-wrapper'>
        {plugin ? (
          <SearchPlugin plugin={plugin} onClose={onClosePlugin} />
        ) : (
          <Logo />
        )}
        <div className='search-content'>
          <input
            ref={inputRef}
            value={value}
            autoFocus
            onChange={onChange}
            className='search-field'
            placeholder='Hi, what can I do for you?'
            onKeyDown={onKeyDown}
            // onBlur={onBlur}
          />
        </div>
        <Button variant='ghost' size='icon' onClick={onOpenMenu}>
          <MicrophoneIcon className='h-6 w-6 text-gray-500' />
        </Button>
      </div>
      <div className='result'>
        <ScrollArea
          className='w-full'
          style={{ height: listHeight }}
          ref={scrollRef}
        >
          <div className='list' ref={listRef}>
            {groupList.map((group) => (
              <div key={group.type}>
                <div className='group-title'>{group.label}</div>
                {group.children.map((item) => (
                  <SearchItem
                    key={item.id}
                    item={item}
                    active={item.index === index}
                    onOpenPlugin={onOpenPlugin}
                  />
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
        <SearchToolbar ref={toolbarRef} />
      </div>
    </div>
  );
};

export default Search;

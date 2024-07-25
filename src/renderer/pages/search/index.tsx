import Logo from '@/components/search/logo';
import { Button } from '@/components/ui/button';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useEventTarget, useMemoizedFn, useUpdateEffect } from 'ahooks';
import {
  MAIN_HIDE,
  MAIN_OPEN_PLUGIN_MENU,
  MAIN_PLUGIN_CLOSE,
  MAIN_PLUGIN_OPEN,
  MAIN_SEARCH,
  MAIN_SEARCH_FOCUS,
  MAIN_SYNC_PLUGIN
} from '@main/config/constants';
import { delayTime } from '@/utils/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SearchItem } from '@/components/search/item';
import { useSearchWrapperRect } from '@/hooks/useSearchWrapperRect';

import './search.css';
import { useSearchScrollViewport } from '@/hooks/useSearchScrollViewport';

const Search = () => {
  const inputRef = useRef();
  const scrollRef = useRef<HTMLDivElement>();
  const [value, { reset, onChange }] = useEventTarget({ initialValue: '' });
  const [list, setList] = useState<IPlugin[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentPlugin, setCurrentPlugin] = useState<IPlugin>();
  const [pluginLoading, setPluginLoading] = useState(false);

  const { listRef, toolbarRef, listHeight } = useSearchWrapperRect();

  const onKeyDown = useMemoizedFn((event: KeyboardEvent) => {
    if (event.code === 'Backspace') {
      if (!value && currentPlugin) {
        event.preventDefault();
        void onClosePlugin();
      }
    }
    if (event.code === 'ArrowDown') {
      event.preventDefault();
      const nextNum = current + 1;
      if (nextNum === list.length - 1) {
        setCurrent(0);
      } else {
        setCurrent(nextNum);
      }
    }
    if (event.code === 'ArrowUp') {
      event.preventDefault();
      const nextNum = current - 1;
      if (current === 0) {
        setCurrent(list.length - 1);
      } else {
        setCurrent(nextNum);
      }
    }
    if (event.code === 'Enter') {
      event.preventDefault();
      if (list[current]) {
        void onOpenPlugin(list[current]);
      }
    }
  });

  const onOpenPlugin = useMemoizedFn(async (item: IPlugin) => {
    setList([]);
    reset();
    setPluginLoading(true);
    await apeak.sendSync(MAIN_PLUGIN_OPEN, item);
    await delayTime(120);
    setPluginLoading(false);
  });

  /**
   * 关闭当前插件
   */
  const onClosePlugin = useMemoizedFn((event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    onReset();
    setCurrentPlugin(undefined);
    apeak.send(MAIN_PLUGIN_CLOSE);
  });

  const onReset = () => {
    setList([]);
    setCurrent(0);
    reset();
  };

  const onOpenMenu = () => {
    apeak.send(MAIN_OPEN_PLUGIN_MENU);
  };

  const onBlur = () => {
    apeak.send(MAIN_SEARCH_FOCUS);
  };

  useUpdateEffect(() => {
    if (!value) {
      setList([]);
      return;
    }
    if (currentPlugin) {
      console.log('通知到插件');
      return;
    }
    apeak.sendSync(MAIN_SEARCH, value).then((data) => {
      setList(data);
    });
  }, [value]);

  useSearchScrollViewport({
    wrapper: scrollRef,
    viewportHeight: listHeight,
    current,
    setCurrent
  });

  useEffect(() => {
    apeak.on(MAIN_HIDE, () => {
      onReset();
    });
    apeak.on(MAIN_SEARCH_FOCUS, () => {
      // inputRef.current?.focus();
    });

    apeak.on(MAIN_SYNC_PLUGIN, (_, data) => {
      setCurrentPlugin(data);
    });
  }, []);

  return (
    <div className='search'>
      <div className='search-wrapper'>
        <Logo />
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
          <DotsVerticalIcon className='h-4 w-4' />
        </Button>
      </div>
      <div className='result'>
        <ScrollArea
          className='w-full'
          style={{ height: listHeight }}
          ref={scrollRef}
        >
          <div className='list' ref={listRef}>
            {list.map((item, index) => (
              <SearchItem
                key={item.id}
                item={item}
                active={index === current}
                onOpenPlugin={onOpenPlugin}
              />
            ))}
          </div>
          <ScrollBar orientation='vertical' />
        </ScrollArea>
        <div className='toolbar' ref={toolbarRef}>
          toolbar
        </div>
      </div>
    </div>
  );
};

export default Search;

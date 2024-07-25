import Logo from '@/components/search/logo';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react';
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
import { useSearchScrollViewport } from '@/hooks/useSearchScrollViewport';
import { SearchToolbar } from '@/components/search/toolbar';
import { orderBy } from 'lodash';
import { clsx } from 'clsx';

import './search.css';

const Search = () => {
  const inputRef = useRef();
  const scrollRef = useRef<HTMLDivElement>();
  const [value, { reset, onChange }] = useEventTarget({ initialValue: '' });
  const [list, setList] = useState<IPlugin[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentPlugin, setCurrentPlugin] = useState<IPlugin>();
  const [pluginLoading, setPluginLoading] = useState(false);
  const [groupList, setGroupList] = useState<IGroupType[]>([]);

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
      const _groupList: IGroupType[] = [
        {
          type: 'app',
          label: '系统应用',
          orderBy: 2,
          showAll: true,
          maxNum: 5,
          children: [],
          originChildren: []
        },
        {
          type: 'plugin',
          label: '插件应用',
          orderBy: 1,
          showAll: true,
          maxNum: 4,
          children: [],
          originChildren: []
        },
        {
          type: 'ai',
          label: 'AI应用',
          orderBy: 3,
          maxNum: 4,
          showAll: true,
          children: [],
          originChildren: []
        }
      ];
      data.forEach((item: IPlugin) => {
        if (item.type === 'app') {
          _groupList[0].originChildren.push(item);
        } else if (item.type === 'built') {
          _groupList[1].originChildren.push(item);
        } else if (item.type === 'ai') {
          _groupList[2].originChildren.push(item);
        }
      });
      _groupList.forEach((item) => {
        if (item.children.length > item.maxNum) {
          item.showAll = false;
          item.children = item.children.slice(0, item.maxNum);
        } else {
          item.showAll = true;
          item.children = item.originChildren;
        }
      });
      setGroupList(orderBy(_groupList, 'orderBy'));
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
            {groupList.map((group) => {
              if (!group.children.length) {
                return null;
              }
              return (
                <div>
                  <div className='group-title'>{group.label}</div>
                  {group.children.map((item, index) => (
                    <Fragment>
                      <SearchItem
                        key={item.id}
                        item={item}
                        active={index === current}
                        onOpenPlugin={onOpenPlugin}
                      />
                      {index === group.children.length - 1 &&
                        !group.showAll && (
                          <div
                            className={clsx('item')}
                            onClick={() => onOpenPlugin(item)}
                          >
                            <div className='flex flex-row justify-start items-center gap-2'>
                              <DotsHorizontalIcon className='w-4 h-4' />
                              <div
                                className='title text-gray-400 ml-1'
                                children='查看更多'
                              />
                            </div>
                          </div>
                        )}
                    </Fragment>
                  ))}
                </div>
              );
            })}
          </div>
          <ScrollBar orientation='vertical' />
        </ScrollArea>
        <SearchToolbar ref={toolbarRef} />
      </div>
    </div>
  );
};

export default Search;

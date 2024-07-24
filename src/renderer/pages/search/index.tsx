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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { clsx } from 'clsx';

const Search = () => {
  const inputRef = useRef();
  const scrollRef = useRef();
  const [value, { reset, onChange }] = useEventTarget({ initialValue: '' });
  const [list, setList] = useState<IPlugin[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentPlugin, setCurrentPlugin] = useState<IPlugin>();
  const [pluginLoading, setPluginLoading] = useState(false);

  const onKeyDown = useMemoizedFn((event: KeyboardEvent) => {
    if (event.code === 'Backspace') {
      if (!value && currentPlugin) {
        event.preventDefault();
        void onClosePlugin();
      }
    }
    if (event.code === 'ArrowDown') {
      event.preventDefault();
      setCurrent(current + 1);
    }
    if (event.code === 'ArrowUp') {
      event.preventDefault();
      if (current !== 0) {
        setCurrent(current - 1);
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
    <div>
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
        <ScrollArea className='' ref={scrollRef}>
          <div className='flex flex-col px-2 py-2'>
            {list.map((item, index) => (
              <div
                className={clsx('item', index === current ? 'active' : '')}
                onClick={() => onOpenPlugin(item)}
              >
                <div className='flex flex-row justify-start items-center gap-2'>
                  <Avatar className='w-5 h-5 rounded-none'>
                    <AvatarImage src={item.logo} alt='@shadcn' />
                    <AvatarFallback>{item.name}</AvatarFallback>
                  </Avatar>
                  <div
                    className='title'
                    dangerouslySetInnerHTML={{ __html: item.nameFormat }}
                  />
                </div>
                <span className='desc'>
                  {item.type === 'app' ? 'application' : item.desc}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Search;

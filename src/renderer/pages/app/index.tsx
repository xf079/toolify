import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { MenuOutlined, PoweroffOutlined } from '@ant-design/icons';
import { useEventTarget, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useStyles } from '@/pages/app/style';
import { Avatar, Button } from 'antd';
import { useConfig } from '@/context';
import Result from '@/components/Result';
import { WINDOW_HEIGHT } from '@common/constants/common';
import {
  MAIN_CLOSE_PLUGIN,
  MAIN_HIDE,
  MAIN_OPEN_PLUGIN, MAIN_OPEN_PLUGIN_MENU,
  MAIN_SEARCH,
  MAIN_SEARCH_FOCUS
} from '@common/constants/event-main';
import { delayTime } from '@/utils/utils';

import Logo from '@/assets/logo.svg?react';

function AppPage() {
  const { styles, cx } = useStyles();
  const { settings } = useConfig();
  const wrapperRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>();
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
    await delayTime(120);
    await apeak.sendSync(MAIN_OPEN_PLUGIN, item);
    setPluginLoading(false);
    if (item.type !== 'app') {
      setCurrentPlugin(item);
    }
  });

  const onClosePlugin = useMemoizedFn(async (event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    onReset();
    await apeak.sendSync(MAIN_CLOSE_PLUGIN, undefined);
  });

  const onReset = () => {
    setList([]);
    setCurrent(0);
    reset();
    setCurrentPlugin(undefined);
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
    if(currentPlugin){
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
      inputRef.current?.focus();
    });
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.wrapper} ref={wrapperRef}>
        {currentPlugin ? (
          <div className={styles.plugin}>
            <Avatar
              src={currentPlugin.logo}
              size={WINDOW_HEIGHT * 0.5}
              className={styles.pluginLogo}
            >
              {currentPlugin.name.substring(0, 1)}
            </Avatar>
            <div className={styles.pluginName}>{currentPlugin.name}</div>
            <PoweroffOutlined
              className={styles.pluginClose}
              onClick={onClosePlugin}
            />
          </div>
        ) : (
          <div className={cx(styles.logo, pluginLoading && 'loading')}>
            <Logo style={{ width: '100%', height: '100%' }} />
          </div>
        )}

        <div
          className={styles.search}
          onClick={() => {
            inputRef.current?.focus();
          }}
        >
          <input
            ref={inputRef}
            value={value}
            autoFocus
            onChange={onChange}
            className={styles.searchValue}
            placeholder={settings.placeholder}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          />
        </div>
        {currentPlugin && <Button icon={<MenuOutlined />} className={styles.menu} type='text' onClick={onOpenMenu} />}
      </div>
      <div className={styles.content}>
        <Result list={list} current={current} onOpen={onOpenPlugin} />
      </div>
    </div>
  );
}

export default AppPage;

import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { PoweroffOutlined } from '@ant-design/icons';
import { useEventTarget, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useStyles } from '@/pages/app/style';
import { Avatar } from 'antd';
import { useConfig } from '@/context';
import Result from '@/components/Result';
import {
  WINDOW_HEIGHT,
  MAIN_HIDE,
  MAIN_PLUGIN_OPEN,
  MAIN_OPEN_PLUGIN_MENU,
  MAIN_SEARCH,
  MAIN_SEARCH_FOCUS,
  MAIN_SYNC_PLUGIN, MAIN_PLUGIN_CLOSE
} from '@main/config/constants';
import { delayTime } from '@/utils/utils';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
    <div className={styles.app}>
      <div
        className={cx(styles.wrapper, currentPlugin && 'border')}
        ref={wrapperRef}
      >
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
            onBlur();
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
            // onBlur={onBlur}
          />
        </div>
        {currentPlugin && (
          <IconButton aria-label='delete' onClick={onOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        )}
      </div>
      <Result list={list} current={current} onOpen={onOpenPlugin} />
    </div>
  );
}

export default AppPage;

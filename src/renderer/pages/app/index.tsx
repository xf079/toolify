import { KeyboardEvent, useEffect, useState } from 'react';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import {
  useEventTarget,
  useMemoizedFn,
  useThrottleFn,
  useUpdateEffect
} from 'ahooks';
import { useStyles } from '@/pages/app/style';
import { useConfig } from '@/context';
import Result from '@/components/Result';
import {
  MAIN_CLOSE_PLUGIN,
  MAIN_OPEN_PLUGIN,
  MAIN_SEARCH
} from '@common/constants/event-main';
import { delayTime } from '@/utils/utils';

import Logo from '@/assets/logo.svg?react';

function AppPage() {
  const { styles, cx } = useStyles();
  const { settings } = useConfig();
  const [value, { reset, onChange }] = useEventTarget({ initialValue: '' });
  const [list, setList] = useState<IPlugin[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentPlugin, setCurrentPlugin] = useState<IPlugin>();
  const [pluginLoading, setPluginLoading] = useState(false);

  const onKeyDown = useMemoizedFn((event: KeyboardEvent) => {
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
    setCurrentPlugin(item);
  });

  const onClosePlugin = useMemoizedFn(async () => {
    setCurrentPlugin(undefined);
    setCurrent(0);
    setList([]);
    reset();
    await apeak.sendSync(MAIN_CLOSE_PLUGIN, undefined);
  });

  const { run } = useThrottleFn(
    async () => {
      if (!value) {
        setList([]);
        return;
      }
      const result = await apeak.sendSync(MAIN_SEARCH, value);
      console.log(result);
      setList(result);
    },
    {
      wait: 300
    }
  );

  useUpdateEffect(() => {
    run();
  }, [value]);

  useEffect(() => {}, []);

  return (
    <div className={styles.app}>
      <div className={styles.wrapper}>
        <div
          className={cx(
            styles.logo,
            pluginLoading && 'loading',
            currentPlugin && 'active'
          )}
        >
          <Logo style={{ width: '100%', height: '100%' }} />
          {currentPlugin ? (
            <div className={styles.plugin}>
              <div className={styles.pluginName}>{currentPlugin.name}</div>
              <CloseOutlined onClick={onClosePlugin} className={styles.pluginClose} />
            </div>
          ) : null}
        </div>

        <div className={styles.search}>
          <input
            value={value}
            onChange={onChange}
            className={styles.searchValue}
            placeholder={settings.placeholder}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <div className={styles.content}>
        <Result list={list} current={current} onOpen={onOpenPlugin} />
      </div>
    </div>
  );
}

export default AppPage;

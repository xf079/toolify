import { KeyboardEvent, useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import {
  useEventTarget,
  useMemoizedFn,
  useThrottleFn,
  useUpdateEffect
} from 'ahooks';
import { useStyles } from '@/pages/app/style';
import { useConfig } from '@/context';
import Result from '@/components/Result';
import { match } from 'pinyin-pro';
import { useTheme } from 'antd-style';
import { MAIN_OPEN_PLUGIN } from '@common/constants/event-main';

function AppPage() {
  const { styles } = useStyles();
  const { colorPrimary } = useTheme();
  const { settings, plugins } = useConfig();
  const [value, { reset, onChange }] = useEventTarget({ initialValue: '' });
  const [list, setList] = useState<IPlugin[]>([]);
  const [current, setCurrent] = useState(0);

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
        onOpen(list[current]);
      }
    }
  });

  const onOpen = (item: IPlugin) => {
    apeak.trigger(MAIN_OPEN_PLUGIN, item);
    setList([]);
    reset();
  };

  const { run } = useThrottleFn(
    () => {
      if (!value) {
        console.log(plugins);
        setList([]);
        return;
      }
      const resultList: IPlugin[] = [];
      plugins.forEach((item: IPlugin) => {
        const indexList = match(item.name, value);
        if (!(indexList || []).length) return;

        const nameList = item.name.split('');
        const nameFormat = nameList.map((val, index) => {
          if ((indexList || []).includes(index)) {
            return `<span style="color: ${colorPrimary};">${val}</span>`;
          }
          return val;
        });
        resultList.push({ ...item, name: nameFormat.join('') });
      });
      setList(resultList);
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
        <div className={styles.search}>
          <input
            value={value}
            onChange={onChange}
            className={styles.searchValue}
            placeholder={settings.placeholder}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className={styles.btn}>
          <UserOutlined className={styles.btnIcon} />
        </div>
      </div>
      <div className={styles.content}>
        <Result list={list} current={current} onOpen={onOpen} />
      </div>
    </div>
  );
}

export default AppPage;

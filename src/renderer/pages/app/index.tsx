import { KeyboardEvent, useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useEventTarget, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useStyles } from '@/pages/app/style';
import { useConfig } from '@/context';
import Result from '@/components/Result';
import { MAIN_SEARCH } from '@common/constants/event-main';

function AppPage() {
  const { styles } = useStyles();
  const { settings } = useConfig();
  const [value, { reset, onChange }] = useEventTarget({ initialValue: '' });
  const [list, setList] = useState<(IPlugin | IApplication)[]>([]);
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
    }
  });

  useUpdateEffect(() => {
    apeak.sync(MAIN_SEARCH, value).then((res) => {
      setList(res);
    });
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
        <Result
          list={list}
          current={current}
          onResetCurrent={() => {
            setCurrent(0);
          }}
        />
      </div>
    </div>
  );
}

export default AppPage;

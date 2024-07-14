import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useStyles } from '@/pages/app/style';
import { useConfig } from '@/context';
import { MAIN_SEARCH } from '@common/constants/event-main';

function AppPage() {
  const { styles } = useStyles();
  const { settings } = useConfig();
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const onSearchChange = (event: any) => {
    const _value = event.target.value;
    setValue(_value);
    apeak?.trigger(MAIN_SEARCH, _value);
  };

  const onToMine = () => {
    navigate('/mine');
  };

  return (
    <div className={styles.app}>
      <div className={styles.wrapper}>
        <div className={styles.search}>
          <input
            value={value}
            onChange={onSearchChange}
            className={styles.searchValue}
            placeholder={settings.placeholder}
          />
        </div>
        <div className={styles.btn} onClick={onToMine}>
          <UserOutlined className={styles.btnIcon} />
        </div>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default AppPage;

import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

import { useStyles } from '@/pages/app/style';


function AppPage() {
  const {styles} = useStyles();
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const onSearchChange = (event: any) => {
    const _value = event.target.value;
    setValue(_value);
    window.ipcRenderer?.send('search', _value);
  };

  const onToPlugin = () => {
    navigate('/plugins');
    window.ipcRenderer?.send('changeWindowResize', { type: 'maximize' });
  };

  return (
    <div className={styles.app}>
      <div className={styles.wrapper}>
        <div className={styles.search}>
          <input
            value={value}
            onChange={onSearchChange}
            className={styles.searchValue}
            placeholder='Hi, Apeak'
          />
        </div>
        <div className={styles.btn} onClick={onToPlugin}>
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

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import PluginIcon from '@/assets/icon/plugin-icon.svg?react';
import CloseIcon from '@/assets/icon/close-icon.svg?react';

import { useStyles } from '@/pages/app/style';

import './index.less';

function AppPage() {
  const {styles} = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState();

  const [list, setList] = useState([]);

  const hasMain = useMemo(() => location.pathname === '/', [location.pathname]);

  const onSearchChange = (event: any) => {
    console.log(event.target.value);
    window.ipcRenderer.on('search', event.target.value);
  };

  const onConfirmSearch = async () => {
    const list = await window.ipcRenderer.invoke('system:appList');
    setList(list);
  };

  const onToPlugin = () => {
    navigate('/plugins');
    window.ipcRenderer?.send('changeWindowResize', { type: 'maximize' });
  };

  const onToApp = () => {
    navigate('/');
    window.ipcRenderer?.send('changeWindowResize', { type: 'minimize' });
  };

  return (
    <div className='app-container'>
      <div className='app-header'>
        <div className='app-search-wrapper'>
          <input
            value={value}
            onInput={onSearchChange}
            className='app-search'
            placeholder='Hi, Zing Panel'
          />
        </div>
        <div className='app-action-wrapper'>
          <div className='app-btn app-btn-plugin' onClick={onToPlugin}>
            <PluginIcon width={26} height={26} color='#fff' />
          </div>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AppPage;

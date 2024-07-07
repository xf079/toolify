import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Image } from 'antd';

import PluginIcon from '@/assets/icon/plugin-icon.svg?react';
import CloseIcon from '@/assets/icon/close-icon.svg?react';

import './index.less';

function AppPage() {
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
    console.log(list);
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
        {!hasMain && (
          <div className='app-breadcrumb'>
            <span className='app-breadcrumb-text'>插件应用中心</span>
            <div className='app-breadcrumb-icon' onClick={onToApp}>
              <CloseIcon width={18} height={18} />
            </div>
          </div>
        )}
        <div className='app-search-wrapper'>
          <input
            value={value}
            onInput={onSearchChange}
            className='app-search'
            placeholder='Hi, Zing Panel'
          />
        </div>
        <div className='app-action-wrapper'>
          <div className='app-btn app-btn-plugin' onClick={onConfirmSearch}>
            <PluginIcon width={26} height={26} color='#fff' />
          </div>
          <div className='app-btn app-btn-plugin' onClick={onToPlugin}>
            <PluginIcon width={26} height={26} color='#fff' />
          </div>
        </div>
      </div>
      {list.map((item, index) => {
        return (
          <div key={index}>
            <Image
              src={'apeak:///' + item.Icon}
              style={{ width: 20, height: 20 }}
            />
            {item.Name}
          </div>
        );
      })}
      <Outlet />
    </div>
  );
}

export default AppPage;

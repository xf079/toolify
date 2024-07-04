import { Button } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';
import EmailIcon from '@/assets/icon/email-icon.svg?react';
import CalendarIcon from '@/assets/icon/calendar-icon.svg?react';
import NotebookIcon from '@/assets/icon/notebook-icon.svg?react';
import TranslationIcon from '@/assets/icon/translation-icon.svg?react';

import './index.less';
import { Outlet } from 'react-router-dom';

const items = [
  {
    label: '翻译',
    key: 'translation',
    icon: <TranslationIcon width={22} height={22} />
  },
  {
    label: '日历',
    key: 'calendar',
    icon: <CalendarIcon width={22} height={22} />
  },
  {
    label: '笔记',
    key: 'cipher',
    icon: <NotebookIcon width={22} height={22} />
  },
  {
    label: '发送邮件',
    key: 'notion',
    icon: <EmailIcon width={22} height={22} />
  }
];

function AppPage() {
  return (
    <div className='app-container'>
      <div className='app-header'>
        <div className='app-search-wrapper'>
          <input className='app-search' placeholder='Hi, Zing Panel' />
        </div>
        <div className='app-user-wrapper'>
          <Button
            shape='circle'
            type='primary'
            icon={<UserSwitchOutlined />}
          ></Button>
        </div>
      </div>
      <div>
        <div className='hot-list'>
          {items.map((item) => (
            <div className='hot-item'>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AppPage;

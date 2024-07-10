import { Menu, MenuProps } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'mine',
    label: '个人中心',
    type: 'group',
    children: [
      { key: '13', label: '账户信息' },
      { key: '14', label: '我的数据' }
    ]
  },
  {
    key: 'settings',
    label: '偏好设置',
    type: 'group',
    children: [
      { key: '15', label: '系统设置' },
      { key: '16', label: '快捷功能' },
      { key: '17', label: '文件管理' },
    ]
  }
];

function MinePage() {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };
  return (
    <div>
      <Menu
        onClick={onClick}
        style={{ width: 180 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode='inline'
        items={items}
      />
      <h1>Electron Vite</h1>
    </div>
  );
}

export default MinePage;

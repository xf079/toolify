import { Menu, MenuProps } from 'antd';
import { useStyles } from '@/pages/system/mine/style';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'mine',
    label: '个人中心',
    icon: <UserOutlined style={{fontSize:18}} />
  },

  {
    key: 'plugins',
    label: '插件中心',
    icon: <PlusOutlined style={{fontSize:18}} />
  }
];

function Developer() {
  const {styles} = useStyles();
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };
  return (
    <div className={styles.container}>
      <Menu
        onClick={onClick}
        style={{ width: 60 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode='inline'
        inlineCollapsed={true}
        items={items}
      />
      <h1>Electron Vite</h1>
    </div>
  );
}

export default Developer;

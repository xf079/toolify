import { Divider, Menu, MenuProps } from 'antd';
import { useStyles } from '@/pages/system/plugins/style';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'mine',
    label: '个人中心',
    icon: <UserOutlined style={{ fontSize: 18 }} />
  },

  {
    key: 'plugins',
    label: '插件中心',
    icon: <PlusOutlined style={{ fontSize: 18 }} />
  }
];

function Plugins() {
  const { styles, cx } = useStyles();
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <span className={styles.navTitle}>效率</span>
        <div className={styles.item}>
          <span>工具</span>
        </div>
        <div className={cx(styles.item, 'active')}>
          <span>工作流程与规划</span>
        </div>
        <div className={styles.item}>
          <span>沟通</span>
        </div>
        <div className={styles.item}>
          <span>教育</span>
        </div>
        <div className={styles.item}>
          <span>开发者工具</span>
        </div>
        <Divider />
        <span className={styles.navTitle}>效率</span>
        <div className={styles.item}>
          <span>工具</span>
        </div>
        <div className={cx(styles.item, 'active')}>
          <span>工作流程与规划</span>
        </div>
        <div className={styles.item}>
          <span>沟通</span>
        </div>
        <div className={styles.item}>
          <span>教育</span>
        </div>
        <div className={styles.item}>
          <span>开发者工具</span>
        </div>
      </div>
      <div className={styles.content}></div>
    </div>
  );
}

export default Plugins;

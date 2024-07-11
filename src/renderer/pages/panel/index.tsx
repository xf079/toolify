import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { createStyles } from 'antd-style';

import { PanelResultList } from '@/components/PanelResultList';

const useStyles = createStyles(({ token, css }) => ({
  panel: css`
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
  `,
  header: css`
    width: 100%;
    height: 56px;
    background-color: ${token.colorBgContainer};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 6px;
    gap: 8px;
    cursor: pointer;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  headerContent: css`
    flex: 1;
    font-size: ${token.fontSize};
    color: ${token.colorTextSecondary};
  `,
  body: css`
    flex: 1;
    overflow: hidden;
    background-color: ${token.colorBgContainer};
  `
}));

function PanelPage() {
  const { styles } = useStyles();
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Button icon={<MenuOutlined />} size='middle' type='text' />
        <div className={styles.headerContent}>超级面板</div>
        <Button icon={<SearchOutlined />} size='middle' type='text' />
      </div>
      <div className={styles.body}>
        <PanelResultList />
      </div>
    </div>
  );
}

export default PanelPage;

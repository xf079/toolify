import { createStyles } from 'antd-style';
import { PanelRow } from '@/components/PanelRow';

const useStyles = createStyles(({ token }) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    padding: `${token.paddingXS}px ${token.paddingXS}px`
  }
}));

export const PanelList = () => {
  const { styles, cx } = useStyles();
  return (
    <div className={styles.list}>
      <PanelRow />
      <PanelRow />
      <PanelRow />
    </div>
  );
};

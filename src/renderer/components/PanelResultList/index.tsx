import { createStyles } from 'antd-style';
import { PanelResultRow } from '@/components/PanelResultRow';

const useStyles = createStyles(({ token }) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    padding: `${token.paddingXS}px ${token.paddingSM}px`
  }
}));

export const PanelResultList = () => {
  const { styles, cx } = useStyles();
  return <div className={styles.list}>
    <PanelResultRow />
    <PanelResultRow />
    <PanelResultRow />
  </div>;
};

import { createStyles } from 'antd-style';
import { TranslationOutlined } from '@ant-design/icons';

const useStyles = createStyles(({ token }) => ({
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    gap: token.marginXS,
    transition: 'background-color 0.1s ease-in-out',
    borderRadius: token.borderRadius,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: token.colorBgLayout
    }
  },
  icon: {
    fontSize:16
  },
  text: {
    fontSize: token.fontSize,
    color: token.colorText,
    fontWeight: 500
  }
}));

export const PanelResultRow = () => {
  const { styles, cx } = useStyles();
  return (
    <div className={styles.row}>
      <TranslationOutlined className={styles.icon} />
      <span className={styles.text}>翻译</span>
    </div>
  );
};

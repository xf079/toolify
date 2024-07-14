import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    flex: 1;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow: hidden;
      border-top: 1px solid ${token.colorSplit};
  `
}));

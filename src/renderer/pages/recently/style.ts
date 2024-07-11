import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
  `,
  content: css`
    width: 100%;
    flex: 1;
    overflow: hidden;
  `,
  toolbar: css`
    background-color: ${token.colorBgContainer};
    padding: ${token.paddingXS}px;
    border-top: 1px solid ${token.colorSplit};
  `
}));

import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  item: css`
    width: 100%;
    padding: ${token.paddingXS}px;
    cursor: pointer;
    &.active {
      background-color: ${token.colorBgTextActive}!important;
    }
    &:hover {
      background-color: ${token.colorBgLayout};
    }
  `,
  logo: css`
    border-radius: ${token.borderRadius}px;
  `,
  content: css`
    flex: 1;
  `
}));

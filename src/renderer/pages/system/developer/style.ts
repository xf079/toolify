import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  `,
  nav: css`
    width: 200px;
    display: flex;
    flex-direction: column;
  `,
  header: css`
    padding: ${token.padding}px;
  `,
  list: css`
    flex: 1;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  `,
  item: css`
    padding: ${token.paddingSM}px ${token.padding}px;
    color: ${token.colorText};
    cursor: pointer;
    margin: 0 !important;
    &.active {
      background-color: ${token.colorBgTextActive}!important;
    }
    &:hover {
      background-color: ${token.colorBgTextHover};
    }
  `,
  content: css`
    flex: 1;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: ${token.paddingLG}px;
  `
}));

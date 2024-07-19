import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    border-top: 1px solid ${token.colorSplit};
  `,
  nav: css`
    width: 160px;
    padding: ${token.paddingSM}px;
  `,
  navTitle: css`
    font-size: 16px;
    display: block;
    line-height: 40px;
    font-weight: 600;
    padding: 0 ${token.paddingSM}px;
    color: ${token.colorText};
  `,
  item: css`
    font-size: 14px;
    display: block;
    line-height: 40px;
    font-weight: 400;
    padding: 0 ${token.paddingSM}px;
    color: ${token.colorText};
    cursor: pointer;
    border-radius: ${token.borderRadius}px;
    &.active {
      background-color: ${token.colorPrimary}!important;
      color: ${token.colorTextLightSolid};
      font-weight: 600;
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
  `
}));

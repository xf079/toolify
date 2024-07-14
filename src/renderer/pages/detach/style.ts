import { createStyles } from 'antd-style';
import { WINDOW_TOOLBAR_HEIGHT } from '@common/constants/common';

export const useStyles = createStyles(({ css, token }) => ({
  toolbar: css`
    width: 100%;
    height: ${WINDOW_TOOLBAR_HEIGHT}px;
    background-color: ${token.colorBgLayout};
  `,
  btn: css`
    width: ${WINDOW_TOOLBAR_HEIGHT}px;
    height: ${WINDOW_TOOLBAR_HEIGHT}px;
    background-color: transparent;
    transition: all 0.1s;
    cursor: pointer;
      font-size: ${token.fontSizeSM}px;
    &:hover {
      background-color: ${token.colorBgContainer};
    }
  `,
  btnClose: css`
    &:hover {
      color: ${token.colorWhite};
      background-color: ${token.colorError};
    }
  `
}));

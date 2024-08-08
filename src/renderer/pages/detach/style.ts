import { createStyles } from 'antd-style';
import {
  SEPARATE_TOOLBAR_HEIGHT,
  WINDOW_TOOLBAR_HEIGHT
} from '@config/constants';

export const useStyles = createStyles(({ css, token }) => ({
  toolbar: css`
    width: 100%;
    height: ${SEPARATE_TOOLBAR_HEIGHT}px;
    background-color: ${token.colorBgLayout};
    -webkit-app-region: drag;
  `,
  logo:css`
    background-color: ${token.colorBgBase};
  `,
  btn: css`
    width: ${SEPARATE_TOOLBAR_HEIGHT}px;
    height: ${SEPARATE_TOOLBAR_HEIGHT}px;
    background-color: transparent;
    transition: all 0.1s;
    cursor: pointer;
    font-size: ${token.fontSizeSM}px;
    -webkit-app-region: no-drag;
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

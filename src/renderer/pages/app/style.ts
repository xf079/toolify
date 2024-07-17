import { createStyles } from 'antd-style';
import { WINDOW_HEIGHT } from '@common/constants/common';

export const useStyles = createStyles(({ token, css }) => ({
  app: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: token.colorBgContainer
  },
  wrapper: css`
    width: 100%;
    display: flex;
    flex-direction: row;
    height: ${WINDOW_HEIGHT}px;
    background-color: ${token.colorBgContainer};
    padding-inline: ${token.paddingXS}px;
    align-items: center;
    flex-shrink: 0;
    gap: 12px;
  `,
  logo: css`
    display: flex;
    justify-content: start;
    align-items: center;
    height: ${WINDOW_HEIGHT - 20}px;
    min-width: ${WINDOW_HEIGHT - 20}px;
    padding: 6px;
    border-radius: ${WINDOW_HEIGHT - 20}px;
    overflow: hidden;
    transition: all 0.2s;
    gap: 8px;
    cursor: pointer;
    &:hover {
      background-color: ${token.colorBgContainer};
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
    }
    &.loading {
      background-color: ${token.colorBgContainer};
      box-shadow: 0 0 6px rgba(0, 555, 0, 0.7);
    }
    &.active {
      background-color: ${token.colorBgContainer};
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.2) !important;
    }
  `,
  plugin: css`
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 6px;
    padding-right: 12px;
  `,
  pluginName: css`
    font-size: 16px;
    font-weight: 200;
    white-space: nowrap;
  `,
  pluginClose: css`
    font-size: 14px;
  `,
  search: css`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: ${token.borderRadius}px;
  `,
  searchValue: css`
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    font-weight: 500;
    background-color: transparent;
    color: ${token.colorTextBase};
    font-size: ${token.fontSizeHeading4}px;
  `,
  btn: css`
    height: 42px;
    width: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.1s;
    border-radius: ${token.borderRadius}px;
    &:hover {
      background-color: ${token.colorBgLayout};
    }
  `,
  btnIcon: css`
    font-size: ${token.fontSizeHeading4}px;
    color: ${token.colorTextTertiary};
  `,
  content: {
    flex: 1
  }
}));

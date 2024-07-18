import { createStyles, keyframes } from 'antd-style';
import { WINDOW_HEIGHT } from '@common/constants/common';

export const useStyles = createStyles(({ token, css }) => {
  const rotate = keyframes`
      100% {
          transform: rotate(360deg);
      }
  `;
  return {
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
      -webkit-app-region: drag;
    `,
    logo: css`
      width: ${WINDOW_HEIGHT - 22}px;
      height: ${WINDOW_HEIGHT - 22}px;
      background-color: ${token.colorBgContainer};
      border-radius: 50%;
      padding: 6px;
      position: relative;
      &.loading {
        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          border-radius: 50%;
          opacity: 0.2;
          border-top: 1px solid ${token.colorPrimary};
          filter: drop-shadow(0 0 2px ${token.colorPrimary})
            drop-shadow(0 0 5px ${token.colorPrimary})
            drop-shadow(0 0 10px ${token.colorPrimary})
            drop-shadow(0 0 20px ${token.colorPrimary});
          animation: ${rotate} 0.6s infinite linear;
        }

        &::after {
          animation-delay: -0.3s;
        }
      }
    `,
    plugin: css`
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 12px;
      padding: ${token.paddingXS}px ${token.paddingSM}px ${token.paddingXS}px
        ${token.paddingXS}px;
      border-radius: ${token.borderRadius}px;
      background-color: ${token.colorBgLayout};
      -webkit-app-region: no-drag;
    `,
    pluginLogo: css``,
    pluginName: css`
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
    `,
    pluginClose: css`
      font-size: 20px;
      color: ${token.colorError};
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
      font-weight: 300;
      background-color: transparent;
      color: ${token.colorTextBase};
      font-size: ${token.fontSizeHeading3}px;
    `,
    menu: css`
      -webkit-app-region: no-drag;
    `,
    content: {
      flex: 1
    }
  };
});

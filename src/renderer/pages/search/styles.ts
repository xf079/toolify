import { createStyles, keyframes } from 'antd-style';
import { WINDOW_HEIGHT } from '@main/config/constants';

export const useStyles = createStyles(({ token, css }) => {
  const rotate = keyframes`
      100% {
          transform: rotate(360deg);
      }
  `;
  return {
    search: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: token.colorBgContainer
    },
    wrapper: css`
      width: 100%;
      height: ${WINDOW_HEIGHT}px;
      background-color: ${token.colorBgContainer};
      border-bottom: 1px solid ${token.colorSplit};
    `,
    logo: css`
      width: ${WINDOW_HEIGHT - 20}px;
      height: ${WINDOW_HEIGHT - 20}px;
      background-color: ${token.colorBgContainer};
      border-radius: 50%;
      padding: 6px;
      position: relative;
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: 50%;
        opacity: 0.4;
        border-top: 1px solid ${token.colorPrimary};
        filter: drop-shadow(0 0 2px ${token.colorPrimary})
          drop-shadow(0 0 5px ${token.colorPrimary})
          drop-shadow(0 0 10px ${token.colorPrimary})
          drop-shadow(0 0 20px ${token.colorPrimary});
        animation: ${rotate} 5s infinite linear;
      }

      &::after {
        animation-delay: -2.5s;
      }
      &.loading {
        &::before,
        &::after {
          animation-duration: 0.5s;
        }
        &::after {
          animation-delay: 0.25s;
        }
      }
    `,
    plugin: css`
      background-color: ${token.colorBgTextHover};
      border-radius: 99999px;
    `,
    close: css`
      &:hover {
        background-color: ${token.colorBgTextActive};
      }
    `,
    input: css`
      color: ${token.colorText};
      width: 100%;
      height: 100%;
      font-size: ${token.fontSizeHeading4}px;
      outline: none;
      font-weight: 300;
      &::placeholder {
        color: ${token.colorTextPlaceholder};
      }
      &.focus {
        -webkit-app-region: drag;
      }
    `,
    result: css``,
    groupTitle: css`
      font-size: 12px;
      font-weight: 300;
      color: ${token.colorTextTertiary};
    `
  };
});

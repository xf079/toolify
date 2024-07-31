import { createStyles } from 'antd-style';

export const useGlobalStyles = createStyles(({ token, css }) => ({
  kbd: css`
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 3px;
    color: ${token.colorTextDescription};
    background-color: ${token.colorBgContainerDisabled};
  `
}));

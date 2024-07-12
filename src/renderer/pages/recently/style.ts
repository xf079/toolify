import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  content: css`
    width: 100%;
    height: 0;
    overflow-y: auto;
  `,
  list: css`
    width: 100%;
  `,
  item: css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: ${token.paddingXS}px;
    background-color: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorSplit};
    cursor: pointer;
      gap: ${token.paddingSM}px;
      color: ${token.colorTextBase};
    &.active,
    &:hover {
      background-color: ${token.colorBgLayout};
    }
  `,
  toolbar: css`
    background-color: ${token.colorBgContainer};
    padding: ${token.paddingXS}px;
    border-top: 1px solid ${token.colorSplit};
  `
}));

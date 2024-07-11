import { createStyles } from 'antd-style';

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
    height: 64px;
    background-color: ${token.colorBgContainer};
    padding-inline: ${token.paddingXS}px;
    align-items: center;
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
    font-weight: 200;
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
  `,
  content: {
    flex: 1,
    overflow: 'hidden'
  }
}));

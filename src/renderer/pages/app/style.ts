import { createStyles } from 'antd-style';


export const useStyles = createStyles(({token})=>({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    overflow: 'hidden',
    transition: 'all 0.3s',
    '&:hover': {
      boxShadow: token.boxShadowTertiary,
      transform: 'scale(1.05)'
    }
  },
  icon: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    color: token.colorTextTertiary
  },
  title: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: token.colorTextTertiary
  }
}))

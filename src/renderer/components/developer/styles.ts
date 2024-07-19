import { createStyles } from 'antd-style';

export const useStyles = createStyles(({token,css})=>{
  return {
    main:css`
        width:460px;
        margin:0 auto;
    `
  }
})
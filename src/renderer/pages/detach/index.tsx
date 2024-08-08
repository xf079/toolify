import { useStyles } from '@/pages/detach/style';
import { Avatar, Button, Flex, Typography } from 'antd';
import {
  BorderOutlined,
  BulbOutlined,
  CloseOutlined,
  LineOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useRef, useState } from 'react';
import { useMount } from 'ahooks';
import { SEPARATE_TOOLBAR_HEIGHT } from '@config/constants';
import { useOs } from '@/hooks/useOs';

export default function Detach() {
  const { styles, cx } = useStyles();

  const winId = useRef(localStorage.getItem('winId')).current;
  const plugin = useRef(JSON.parse(localStorage.getItem('plugin') || '{}')).current as IPlugin;

  const [isMaximize, setIsMaximize] = useState(false);
  const { isMac } = useOs();

  const onMinimize = () => {
    eventApi.send(`detach:${winId}`, { type: `minimize` });
  };

  const onToggleSize = () => {
    if (isMaximize) {
      setIsMaximize(false);
      eventApi.send(`detach:${winId}`, { type: `restore` });
    } else {
      setIsMaximize(true);
      eventApi.send(`detach:${winId}`, {
        type: `maximize`
      });
    }
  };

  const onClose = () => {
    eventApi.send(`detach:${winId}`, { type: 'close' });
  };

  useMount(() => {
    eventApi.on(`detach:${winId}`, (event, args) => {
      switch (args.type) {
        case 'maximize':
          setIsMaximize(true);
          break;
        case 'restore':
          setIsMaximize(false);
          break;
      }
    });
  });

  return (
    <Flex
      className={cx(styles.toolbar, isMac ? 'pl-20' : '')}
      justify='space-between'
      align='center'
    >
      {plugin ? (
        <Flex gap={12} className='pl-2.5' align='center'>
          <Avatar
            src={plugin.logo}
            size={SEPARATE_TOOLBAR_HEIGHT * 0.6}
            shape='square'
            className={cx(styles.logo, 'p-1')}
          />
          <Typography.Text strong>{plugin.name}</Typography.Text>
        </Flex>
      ) : null}
      <Flex gap={12} align='center'>
        <Flex align='center' gap={2} className='pr-2'>
          <Button className={styles.obtn} type='text' size='middle' icon={<BulbOutlined />} />
          <Button className={styles.obtn} type='text' size='middle' icon={<SettingOutlined />} />
        </Flex>
        {!isMac ? (
          <Flex gap={6}>
            <Flex
              className={styles.btn}
              justify='center'
              align='center'
              onClick={onMinimize}
            >
              <LineOutlined />
            </Flex>
            <Flex
              className={styles.btn}
              justify='center'
              align='center'
              onClick={onToggleSize}
            >
              <BorderOutlined />
            </Flex>
            <Flex
              className={cx(styles.btn, styles.btnClose)}
              justify='center'
              align='center'
              onClick={onClose}
            >
              <CloseOutlined />
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
}

import { useStyles } from '@/pages/detach/style';
import { Avatar, Button, Flex, Typography } from 'antd';
import {
  BorderOutlined,
  BulbOutlined,
  CloseOutlined,
  LineOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  DETACH_SERVICE,
  SEPARATE_TOOLBAR_HEIGHT
} from '@main/config/constants';
import { useState } from 'react';
import { useOs } from '@/hooks/useOs';
import { useMount } from 'ahooks';

export default function Detach() {
  const { styles, cx } = useStyles();
  const [isMaximize, setIsMaximize] = useState(false);
  const { isMac } = useOs();

  const onMinimize = () => {
    ipc.send(`${DETACH_SERVICE}_${__plugin__.unique}`, { type: `minimize` });
  };

  const onToggleSize = () => {
    if (isMaximize) {
      setIsMaximize(false);
      ipc.send(`${DETACH_SERVICE}_${__plugin__.unique}`, { type: `restore` });
    } else {
      setIsMaximize(true);
      ipc.send(`${DETACH_SERVICE}_${__plugin__.unique}`, {
        type: `maximize`
      });
    }
  };

  const onClose = () => {
    ipc.send(`${DETACH_SERVICE}_${__plugin__.unique}`, { type: 'close' });
  };

  useMount(() => {
    ipc.on(`${DETACH_SERVICE}_${__plugin__.unique}`, (event, args) => {
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
      {__plugin__ ? (
        <Flex gap={12} className='pl-2.5' align='center'>
          <Avatar
            src={__plugin__.logo}
            size={SEPARATE_TOOLBAR_HEIGHT * 0.6}
            shape='square'
            className={cx(styles.logo, 'p-1')}
          />
          <Typography.Text strong>{__plugin__.name}</Typography.Text>
        </Flex>
      ) : null}
      <Flex gap={12} align='center'>
        <Flex align='center' gap={2}>
          <Button type='text' size='middle' icon={<BulbOutlined />} />
          <Button type='text' size='middle' icon={<SettingOutlined />} />
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

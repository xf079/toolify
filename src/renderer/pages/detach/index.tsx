import { useStyles } from '@/pages/detach/style';
import { Avatar, Button, Flex, Typography } from 'antd';
import {
  BorderOutlined,
  BulbOutlined,
  CloseOutlined,
  LineOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { DETACH_SERVICE, SEPARATE_HEIGHT, SEPARATE_TOOLBAR_HEIGHT } from '@main/config/constants';
import { useState } from 'react';

export default function Detach() {
  const { styles, cx } = useStyles();

  const [isMaximize, setIsMaximize] = useState(false);

  const onMinimize = () => {
    apeak.send(`${DETACH_SERVICE}_${__plugin__.unique}`, { type: `minimize` });
  };

  const onToggleSize = () => {
    if (isMaximize) {
      setIsMaximize(false);
      apeak.send(`${DETACH_SERVICE}_${__plugin__.unique}`, { type: `restore` });
    } else {
      setIsMaximize(true);
      apeak.send(`${DETACH_SERVICE}_${__plugin__.unique}`, {
        type: `maximize`
      });
    }
  };

  const onClose = () => {
    apeak.send(`${DETACH_SERVICE}_${__plugin__.unique}`, { type: 'close' });
  };

  return (
    <Flex className={styles.toolbar} justify='space-between' align='center'>
      <Flex gap={12} className='pl-3'>
        <Avatar src={__plugin__.logo} size={SEPARATE_TOOLBAR_HEIGHT / 2} className='p-2' />
        <Typography.Text strong>{__plugin__.name}</Typography.Text>
      </Flex>
      <Flex gap={12} align='center'>
        <Flex align='center' gap={2}>
          <Button type='text' size='middle' icon={<BulbOutlined />} />
          <Button type='text' size='middle' icon={<SettingOutlined />} />
        </Flex>
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
      </Flex>
    </Flex>
  );
}

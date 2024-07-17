import { useStyles } from '@/pages/detach/style';
import { Button, Flex } from 'antd';
import {
  BorderOutlined,
  BulbOutlined,
  CloseOutlined,
  LineOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { DETACH_SERVICE } from '@common/constants/event-detach';
import { useState } from 'react';

export default function Detach() {
  const { styles, cx } = useStyles();

  const [isMaximize, setIsMaximize] = useState(false);

  const onMinimize = () => {
    apeak.send(DETACH_SERVICE, { type: 'size:minimize' });
  };

  const onToggleSize = () => {
    if (isMaximize) {
      apeak.send(DETACH_SERVICE, { type: 'size:default' });
    } else {
      setIsMaximize(true)
      apeak.send(DETACH_SERVICE, { type: 'size:maximize' });
    }
    apeak.send(DETACH_SERVICE, { type: 'size:toggle' });
  };

  const onClose = () => {
    apeak.send(DETACH_SERVICE, { type: 'close' });
  };

  return (
    <Flex className={styles.toolbar} justify='space-between' align='center'>
      <Flex>
        <span>logo</span>
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

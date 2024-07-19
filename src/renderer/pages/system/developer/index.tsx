import { Button, Flex, Tooltip } from 'antd';
import { useStyles } from '@/pages/system/developer/style';
import { AppstoreAddOutlined, BookOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { CreateAndUpdatePlugin } from '@/components/developer';
import { ICreateAndUpdatePluginRef } from '@/components/developer/CreateAndUpdatePlugin';
function Developer() {
  const { styles } = useStyles();

  const pluginRef = useRef<ICreateAndUpdatePluginRef>();

  const onCreatePlugin = () => {
    pluginRef.current?.open();
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Flex justify='space-between' align='center'>
          <Button
            type='primary'
            shape='round'
            size='middle'
            icon={<AppstoreAddOutlined />}
            onClick={onCreatePlugin}
          >
            添加插件
          </Button>
          <Tooltip title='查看文档'>
            <Button
              size='small'
              type='text'
              shape='circle'
              icon={<BookOutlined />}
            />
          </Tooltip>
        </Flex>
      </div>
      <div></div>
      <CreateAndUpdatePlugin ref={pluginRef} />
    </div>
  );
}

export default Developer;

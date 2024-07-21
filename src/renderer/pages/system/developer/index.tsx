import { useRef, useState } from 'react';
import { useMount } from 'ahooks';
import {
  Button,
  Descriptions,
  Flex,
  Tabs,
  TabsProps,
  Tooltip,
  Typography
} from 'antd';
import { AppstoreAddOutlined, BookOutlined } from '@ant-design/icons';
import { CreateAndUpdatePlugin } from '@/components/developer';
import { ICreateAndUpdatePluginRef } from '@/components/developer/CreateAndUpdatePlugin';
import { BUILT_PLUGIN_LIST } from '@main/config/constants';
import { useStyles } from './style';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '开发',
    children: 'Content of Tab Pane 1'
  },
  {
    key: '2',
    label: '发布',
    children: 'Content of Tab Pane 2'
  }
];

function Developer() {
  const { styles, cx } = useStyles();
  const [list, setList] = useState<IDeveloperPlugin[]>([]);
  const [currentPlugin, setCurrentPlugin] = useState<IDeveloperPlugin>();
  const pluginRef = useRef<ICreateAndUpdatePluginRef>(null);

  const onQueryPluginList = async () => {
    const list = await apeak.sendSync(BUILT_PLUGIN_LIST);
    setList(list);
  };

  const onCreatePlugin = () => {
    pluginRef.current?.open();
  };

  const onFinish = () => {
    void onQueryPluginList();
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  useMount(async () => {
    await onQueryPluginList();

    if (list.length) {
      setCurrentPlugin(list[0]);
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.header}>
          <Button
            type='primary'
            block
            icon={<AppstoreAddOutlined />}
            onClick={onCreatePlugin}
          >
            添加插件
          </Button>
        </div>
        <div className={styles.list}>
          {list.map((item) => (
            <Typography.Title
              key={item.unique}
              level={5}
              className={cx(
                styles.item,
                item.unique === currentPlugin?.unique && 'active'
              )}
              onClick={() => setCurrentPlugin(item)}
            >
              {item.name}
            </Typography.Title>
          ))}
        </div>
        <Button type='text' block icon={<BookOutlined />} >开发文档</Button>
      </div>
      {currentPlugin ? (
        <div className={styles.content}>
          <Typography.Title level={3}>{currentPlugin.name}</Typography.Title>
          <Descriptions
            items={[
              {
                label: '应用标识',
                span: 24,
                children: currentPlugin.unique
              },
              {
                label: '应用主页',
                span: 24,
                children: currentPlugin.homepage
              }
            ]}
          />
          <Tabs defaultActiveKey='1' items={items} onChange={onChange} />;
        </div>
      ) : null}
      <CreateAndUpdatePlugin ref={pluginRef} onFinish={onFinish} />
    </div>
  );
}

export default Developer;

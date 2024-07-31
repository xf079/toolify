import { useState } from 'react';
import { useMount } from 'ahooks';
import {
  BUILD_IMPORT_PLUGIN,
  BUILT_PLUGIN_LIST,
  BUILT_UPDATE_PLUGIN
} from '@main/config/constants';
import { clsx } from 'clsx';
import {
  Flex,
  Typography,
  Button,
  notification,
  Segmented,
  Descriptions,
  DescriptionsProps
} from 'antd';
import {
  CodeOutlined,
  ExperimentOutlined,
  HighlightOutlined,
  ImportOutlined,
  ReloadOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

function Developer() {
  const [list, setList] = useState<IDeveloperPlugin[]>([]);
  const [plugin, setPlugin] = useState<IDeveloperPlugin>();

  const onQueryPluginList = async () => {
    const list = await apeak.sendSync(BUILT_PLUGIN_LIST);
    setList(list);
    if (list.length && !plugin) {
      setPlugin(list[0]);
    }
  };

  /**
   * 导入插件
   * @description 从本地导入插件，并更新插件列表
   */
  const onImportPlugin = async () => {
    const result = await apeak.sendSync(BUILD_IMPORT_PLUGIN);
    if (result.success) {
      void onQueryPluginList();
      setPlugin(result.data);
      notification.success({
        message: '成功',
        description: '插件导入成功'
      });
    } else {
      notification.error({
        message: '插件导入失败',
        description: result.message
      });
    }
  };

  const onStartPlugin = async () => {
    const result = await apeak.sendSync(BUILT_UPDATE_PLUGIN, {
      ...plugin,
      running: true
    });
  };

  const pluginItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '应用标识',
      children: 'Cloud Database'
    },
    {
      key: '2',
      label: '开发者',
      children: 'Prepaid'
    },
    {
      key: '3',
      label: '应用主页',
      children: 'Prepaid'
    },
    {
      key: '4',
      label: '应用描述',
      children: 'Prepaid'
    }
  ];

  useMount(() => {
    void onQueryPluginList();
  });

  return (
    <div className='w-full'>
      {list.length ? (
        <div className='flex flex-row'>
          <div className='w-56 py-4 px-2 bg-gray-50 h-screen'>
            <Flex justify='space-between' align='center' gap={12}>
              <Button type='primary' block onClick={onImportPlugin}>
                导入插件
              </Button>
              <Button type='text'>文档</Button>
            </Flex>
            <div className='w-full py-4 overflow-y-auto'>
              <ul className='space-y-2 font-medium'>
                {list.map((item) => (
                  <li key={item.id}>
                    <a
                      className={clsx(
                        'flex items-center font-extrabold cursor-pointer p-2 text-gray-900 rounded-lg hover:bg-gray-100',
                        { 'bg-gray-100': plugin?.id === item.id }
                      )}
                    >
                      <span className='ms-3 text-sm'>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='flex-1 p-4 overflow-y-auto'>
            {plugin ? (
              <Flex vertical gap={24}>
                <Descriptions
                  title={plugin.name}
                  column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                  extra={
                    <Flex gap={16}>
                      <Button type='text' icon={<ReloadOutlined />} />
                      <Button type='text' icon={<HighlightOutlined />} />
                    </Flex>
                  }
                  items={pluginItems}
                />
                <Segmented
                  size='large'
                  block
                  options={[
                    {
                      value: 'developer',
                      label: '开发',
                      icon: <CodeOutlined />
                    },
                    {
                      value: 'version',
                      label: '版本',
                      icon: <UnorderedListOutlined />
                    }
                  ]}
                />
              </Flex>
            ) : null}
          </div>
        </div>
      ) : (
        <Flex
          className='px-8 pt-14 h-full'
          align='center'
          justify='center'
          vertical
        >
          <ExperimentOutlined className='text-[44px] opacity-75' />
          <Typography.Title level={3} className='mt-4'>
            您还没有插件应用哦！
          </Typography.Title>
          <Typography.Text type='secondary'>
            点击下方按钮导入插件应用
          </Typography.Text>
          <Button
            type='primary'
            size='large'
            onClick={onImportPlugin}
            icon={<ImportOutlined />}
            className='w-44 mt-5'
          >
            导入插件
          </Button>
        </Flex>
      )}
    </div>
  );
}

export default Developer;

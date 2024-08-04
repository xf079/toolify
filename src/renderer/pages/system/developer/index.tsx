import { useMemo, useRef, useState } from 'react';
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
  Segmented,
  Descriptions,
  DescriptionsProps,
  message,
  Tooltip,
  Alert,
  Dropdown,
  Avatar,
  Switch,
  MenuProps
} from 'antd';
import {
  AlignRightOutlined,
  CodeOutlined,
  FolderOpenOutlined,
  ReloadOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { Empty } from '@/components/developer';
import {
  CreatePlugin,
  ICreateOrUpdatePluginRef
} from '@/components/developer/create-plugin';

import CreatePluginIcon from '@/assets/icon/create-folder-icon.svg?react';

function Developer() {
  const [list, setList] = useState<IDeveloperPlugin[]>([]);
  const [plugin, setPlugin] = useState<IDeveloperPlugin>();

  const [type, setType] = useState('developer');

  const createPluginRef = useRef<ICreateOrUpdatePluginRef>(null);

  const onQueryPluginList = async () => {
    const list = await apeak.sendSync(BUILT_PLUGIN_LIST);
    setList(list);
    console.log(list);
    if (list.length && !plugin) {
      setPlugin(list[0]);
    }
  };

  const onCreatePluginHandle = () => {
    createPluginRef.current?.open();
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
      console.log(result.data);
      message.success('插件导入成功');
    } else {
      message.success('插件导入失败');
    }
  };

  /**
   * 刷新插件
   */
  const onRefreshPlugin = async () => {
    const result = await apeak.sendSync(BUILT_UPDATE_PLUGIN);
    setList(result);
    if (result.length && !plugin) {
      setPlugin(result[0]);
    }
  };

  const onStartPlugin = async () => {
    const result = await apeak.sendSync(BUILT_UPDATE_PLUGIN, {
      ...plugin,
      running: true
    });
  };

  const pluginItems = useMemo(() => {
    if (plugin) {
      return [
        {
          key: '1',
          label: '应用标识',
          children: plugin.unique
        },
        {
          key: '2',
          label: '开发者',
          children: 'Prepaid'
        },
        {
          key: '3',
          label: '应用主页',
          children: plugin.homepage || '-'
        },
        {
          key: '4',
          label: '应用描述',
          children: plugin.description || '-'
        }
      ] as DescriptionsProps['items'];
    }
    return [];
  }, [plugin]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '修改项目'
    },
    {
      key: '2',
      label: '重置秘钥'
    },
    {
      key: '4',
      danger: true,
      label: '删除项目'
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
              <Button
                type='primary'
                block
                icon={<CreatePluginIcon className='w-5 h-5' />}
                onClick={onCreatePluginHandle}
              >
                创建插件应用
              </Button>
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
              <Flex vertical gap={12}>
                <Descriptions
                  title={plugin.name}
                  size='small'
                  column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                  extra={
                    <Flex gap={16}>
                      <Tooltip title='刷新插件'>
                        <Button type='text' icon={<ReloadOutlined />} />
                      </Tooltip>
                      <Dropdown menu={{ items }}>
                        <Button type='text' icon={<AlignRightOutlined />} />
                      </Dropdown>
                    </Flex>
                  }
                  items={pluginItems}
                />
                <Segmented
                  block
                  value={type}
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
                  onChange={setType}
                />
                {type === 'developer' ? (
                  <Flex vertical gap={24}>
                    {plugin.message ? (
                      <Alert type='error' message={plugin.message} />
                    ) : null}
                    <Flex gap={12} align='center'>
                      <Avatar src={plugin.logo} size={32} />
                      <Flex vertical className='flex-1'>
                        <Typography.Text strong>未运行</Typography.Text>
                        <Typography.Text type='secondary'>
                          {plugin.main}
                        </Typography.Text>
                      </Flex>
                      <Tooltip title='在资源管理器中显示'>
                        <Button type='text' icon={<FolderOpenOutlined />} />
                      </Tooltip>
                    </Flex>
                    <Flex gap={12} align='center'>
                      <Flex vertical className='flex-1'>
                        <Typography.Text strong>
                          退出到后台立即结束运行
                        </Typography.Text>
                        <Typography.Text type='secondary'>
                          开启后每次打开插件应用都会重新加载最新代码
                        </Typography.Text>
                      </Flex>
                      <Switch />
                    </Flex>
                    <Flex>
                      <Flex vertical>
                        <Typography.Text strong>立即运行</Typography.Text>
                        <Typography.Text type='secondary'>
                          允许中才可搜索调试
                        </Typography.Text>
                      </Flex>
                    </Flex>
                    <Flex>
                      <Flex vertical>
                        <Typography.Text strong>打包</Typography.Text>
                        <Typography.Text type='secondary'>
                          打包为可离线安装的APE文件
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </Flex>
                ) : (
                  <div>456</div>
                )}
              </Flex>
            ) : null}
          </div>
        </div>
      ) : (
        <Empty onCreate={onCreatePluginHandle} />
      )}
      <CreatePlugin ref={createPluginRef} onFinish={onQueryPluginList} />
    </div>
  );
}

export default Developer;

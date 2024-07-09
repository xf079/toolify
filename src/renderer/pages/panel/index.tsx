import { useMemo } from 'react';
import {
  DeliveredProcedureOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { ItemType } from 'antd/es/menu/interface';

import './index.less';

function PanelPage() {
  const items = useMemo<ItemType[]>(
    () => [
      {
        key: '1',
        label: '问问AI',
        icon: <QuestionCircleOutlined />
      },
      {
        key: '11',
        label: '添加到备忘录',
        icon: <DeliveredProcedureOutlined />
      },
      {
        key: 'divider',
        type: 'divider'
      },
      {
        key: '2',
        label: '发现更多',
        icon: <SendOutlined />
      },
      {
        key: '3',
        label: '自定义设置',
        icon: <SettingOutlined />
      },
      {
        key: '4',
        label: '禁用',
        danger: true,
        icon: <LogoutOutlined />
      }
    ],
    []
  );
  return (
    <div>123</div>
    /*<Flex className='toolbar' align='center'>
      <Button
        type='text'
        size='middle'
        icon={<SearchOutlined />}
        className='toolbar-btn'
      >
        搜索
      </Button>
      <Button
        type='text'
        size='middle'
        icon={<TranslationOutlined />}
        className='toolbar-btn'
      >
        翻译
      </Button>
      <Button
        type='text'
        size='middle'
        icon={<BlockOutlined />}
        className='toolbar-btn'
      >
        复制
      </Button>
      <Button
        type='text'
        size='middle'
        icon={<BookOutlined />}
        className='toolbar-btn'
      >
        解释
      </Button>
      <Divider type='vertical' />
      <Dropdown menu={{ items }}>
        <Button type='text' size='middle' icon={<MenuOutlined />} />
      </Dropdown>
    </Flex>*/
  );
}

export default PanelPage;

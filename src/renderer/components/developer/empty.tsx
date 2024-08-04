import { FC } from 'react';
import { Button, Flex, Typography } from 'antd';

import EmptyIcon from '@/assets/icon/compass-tool-icon.svg?react';
import CreatePluginIcon from '@/assets/icon/create-folder-icon.svg?react';


export interface EmptyProps {
  onCreate: () => void;
}

export const Empty:FC<EmptyProps> = ({onCreate}) => {
  return (
    <Flex
      className='px-8 pt-16 h-full'
      align='center'
      justify='center'
      vertical
    >
      <EmptyIcon
        className='w-16 h-16'
      />
      <Typography.Title level={4} className='mt-6'>
        您还没有插件应用哦！
      </Typography.Title>
      <Typography.Text type='secondary'>
        点击下方按钮创建插件应用
      </Typography.Text>
      <Button
        type='primary'
        onClick={onCreate}
        icon={<CreatePluginIcon className='w-5 h-5' />}
        className='w-44 mt-5'
      >
        创建插件应用
      </Button>
    </Flex>
  );
};

import { Button, Drawer, Flex, Form, Input, message, Typography } from 'antd';
import { nanoid } from 'nanoid';
import { useStyles } from './styles';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  BUILT_CREATE_PLUGIN,
  BUILT_UPDATE_PLUGIN
} from '@main/config/constants';

export interface ICreateAndUpdatePluginProps {
  onFinish?: () => void;
}

export interface ICreateOrUpdatePluginRef {
  open: (data?: IDeveloperPlugin) => void;
}

export const CreatePlugin = forwardRef<
  ICreateOrUpdatePluginRef,
  ICreateAndUpdatePluginProps
>(({ onFinish }, ref) => {
  const { styles } = useStyles();
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: (data?: IDeveloperPlugin) => {
      setEdit(!!data);
      if (data) {
        form.setFieldsValue(data);
      }
      setOpen(true);
    }
  }));

  const onCreatePlugin = async (data: IPlugin) => {
    if (edit) {
      const result = await eventApi.sync(BUILT_UPDATE_PLUGIN, data);
      if (result.success) {
        setOpen(false);
        onFinish?.();
        message.success('更新成功');
      } else {
        message.error(result.message);
      }
    } else {
      const result = await eventApi.sync(BUILT_CREATE_PLUGIN, {
        ...data,
        unique: nanoid()
      });
      if (result.success) {
        setOpen(false);
        onFinish?.();
        message.success('创建成功');
      } else {
        message.error(result.message);
      }
    }
  };

  const onConfirm = async () => {
    const values = await form.validateFields();
    await onCreatePlugin(values);
  };
  return (
    <Drawer placement='bottom' height='auto' closable={false} open={open}>
      <div className={styles.main}>
        <Typography.Title level={3} style={{ marginTop: 12 }}>
          创建插件应用
        </Typography.Title>
        <Form layout='vertical' form={form} style={{ marginTop: 20 }}>
          <Form.Item
            label='应用名称'
            name='name'
            rules={[{ required: true, message: '必填项' }]}
          >
            <Input placeholder='请输入插件名成' style={{ width: '66%' }} />
          </Form.Item>
          <Form.Item
            label='项目主页'
            name='homepage'
            rules={[{ required: true, message: '必填项' }]}
          >
            <Input placeholder='请输入项目主页' />
          </Form.Item>
          <Form.Item
            label='应用描述'
            name='desc'
            rules={[{ required: true, message: '必填项' }]}
          >
            <Input.TextArea placeholder='请输入插件描述' />
          </Form.Item>
        </Form>
        <Flex gap={22} justify='flex-end'>
          <Button shape='round' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button type='primary' shape='round' onClick={onConfirm}>
            确认创建
          </Button>
        </Flex>
      </div>
    </Drawer>
  );
});

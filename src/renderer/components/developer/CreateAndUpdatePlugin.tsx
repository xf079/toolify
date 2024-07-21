import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  notification,
  Typography
} from 'antd';
import { nanoid } from 'nanoid';
import { useStyles } from './styles';
import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  BUILT_CREATE_PLUGIN,
  BUILT_UPDATE_PLUGIN
} from '@main/config/constants';

export interface ICreateAndUpdatePluginProps {
  onFinish: () => void;
}

export interface ICreateAndUpdatePluginRef {
  open: (data?: IDeveloperPlugin) => void;
}

export const CreateAndUpdatePlugin = forwardRef<
  ICreateAndUpdatePluginRef,
  ICreateAndUpdatePluginProps
>(({ onFinish }, ref) => {
  const { styles } = useStyles();
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: (data) => {
      if (data) {
        form.setFieldsValue(data);
        setEdit(true);
      }
      setOpen(true);
    }
  }));

  const onCreatePlugin = async (data: IPlugin) => {
    try {
      if (edit) {
        await apeak.sendSync(BUILT_UPDATE_PLUGIN, data);
      } else {
        await apeak.sendSync(BUILT_CREATE_PLUGIN, {
          ...data,
          unique: nanoid()
        });
      }
      setOpen(false);
      onFinish();
    } catch (error) {
      console.log(error);
    }
  };

  const onConfirm = async () => {
    const values = await form.validateFields();
    await onCreatePlugin(values);
    notification.success({
      message: edit ? '更新成功' : '创建成功'
    });
  };
  return (
    <Drawer placement='bottom' height='100%' closable={false} open={open}>
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

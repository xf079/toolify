import { useState } from 'react';
import { useMount } from 'ahooks';
import {
  BUILD_IMPORT_PLUGIN,
  BUILT_PLUGIN_LIST,
  BUILT_UPDATE_PLUGIN
} from '@main/config/constants';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { clsx } from 'clsx';

import FluentInfoIcon from '@/assets/icon/fluent--info-48-regular.svg?react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Developer() {
  const [list, setList] = useState<IDeveloperPlugin[]>([]);
  const [plugin, setPlugin] = useState<IDeveloperPlugin>();

  const { toast } = useToast();

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
    console.log(result);
    if (result.success) {
      void onQueryPluginList();
      setPlugin(result.data);
    } else {
      toast({
        type: 'background',
        title: '插件导入失败',
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

  useMount(() => {
    void onQueryPluginList();
  });

  return (
    <div className='w-full'>
      {list.length ? (
        <div className='flex flex-row'>
          <div className='w-56 py-4 px-2'>
            <Button className='w-full'>导入插件</Button>
            <div className='w-full py-4 px-2 overflow-y-auto'>
              <ul className='space-y-2 font-medium'>
                {list.map((item) => (
                  <li key={item.id}>
                    <a
                      className={clsx(
                        'flex items-center font-extrabold cursor-pointer p-2 text-gray-900 rounded-lg hover:bg-gray-100',
                        { 'bg-gray-100': plugin?.id === item.id }
                      )}
                    >
                      <span className='ms-3'>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='flex-1 p-4 overflow-y-auto'>
            {plugin ? (
              <div>
                {plugin.name}
                {plugin.source}
                <Tabs defaultValue='account' className='w-[400px]'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='account'>Account</TabsTrigger>
                    <TabsTrigger value='password'>Password</TabsTrigger>
                  </TabsList>
                  <TabsContent value='account'>1</TabsContent>
                  <TabsContent value='password'>2</TabsContent>
                </Tabs>
                <Button className='w-full' onClick={onStartPlugin}>
                  启动运行
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center px-8 pt-12 h-full'>
          <div className='w-[88%] p-8 mt-4 border-dashed border border-gray-50 flex flex-col justify-center items-center'>
            <FluentInfoIcon className='w-14 h-14 text-gray-600' />
            <h3 className='mt-4 text-lg font-semibold'>您还没有插件应用哦！</h3>
            <p className='mb-4 mt-2 text-sm text-muted-foreground'>
              You have not added any podcasts. Add one below.
            </p>
            <div className='flex flex-row gap-4'>
              <Button
                onClick={onImportPlugin}
                variant='secondary'
                className='w-28'
              >
                导入插件
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Developer;

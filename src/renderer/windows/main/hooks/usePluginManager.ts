import {
  useEventTarget,
  useMemoizedFn,
  useMount,
  useUpdateEffect
} from 'ahooks';
import { KeyboardEvent, useMemo, useState } from 'react';
import {
  generateGroupIndex,
  generatePluginGroup,
  generateToggleGroupList
} from '../utils/pluginHandler';

export const usePluginManager = () => {
  const [value, { reset, onChange }] = useEventTarget({ initialValue: '' });
  const [plugins, setPlugins] = useState<IGroupType[]>([]);
  const [plugin, setPlugin] = useState<IPlugin>();
  const [index, setIndex] = useState(1);
  const [focus, setFocus] = useState(false);
  const [pluginLoading, setPluginLoading] = useState(false);

  /**
   * 插件列表最大索引
   */
  const pluginMaxIndex = useMemo(() => {
    if (!plugins.length) return 0;
    const lastGroup = plugins[plugins.length - 1];
    const childList = lastGroup.children.length;
    return lastGroup.children[childList - 1].index;
  }, [plugins]);

  /**
   * 插件列表 列表结构
   */
  const pluginList = useMemo(() => {
    return plugins.reduce(
      (accumulator, currentValue) => accumulator.concat(currentValue.children),
      []
    );
  }, [plugins]);

  const onValueKeyDown = useMemoizedFn((event: KeyboardEvent) => {
    if (event.code === 'Backspace') {
      if (!value && plugin) {
        event.preventDefault();
        void onClosePlugin();
      }
    }
    if (event.code === 'ArrowDown') {
      event.preventDefault();
      const nextNum = index + 1;
      setIndex(nextNum > pluginMaxIndex ? 1 : nextNum);
    }
    if (event.code === 'ArrowUp') {
      event.preventDefault();
      const nextNum = index - 1;
      setIndex(nextNum < 1 ? pluginMaxIndex : nextNum);
    }
    if (event.code === 'Enter') {
      event.preventDefault();
      const _plugin = pluginList.find((item) => item.index === index);
      if (_plugin) {
        // void onOpenPlugin(_plugin);
      }
    }
  });

  /**
   * 打开插件
   */
  const onOpenPlugin = useMemoizedFn(
    async (item: IResultType, type: IResultEnumType) => {
      /**
       * 展开更多处理
       */
      if (item.type === 'more') {
        setPlugins(generateGroupIndex(generateToggleGroupList(plugins, type)));
        return;
      }
      /**
       * 系统app
       */
      if (type === 'app') {
        console.log(item);
        console.log(`start ${item.main}`);
        // execFile(`${item.main}`);
        return;
      }

      setPlugins([]);
      setIndex(1);
      reset();
      setPluginLoading(true);
      // await eventApi.sync('main:openPlugin', omit(item,'nameFormat'));
      setPluginLoading(false);
    }
  );

  /**
   * 关闭当前插件
   */
  const onClosePlugin = useMemoizedFn((event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    setPlugin(undefined);
    setPlugins([]);
    setIndex(1);
    reset();
    // eventApi.send('main:closePlugin');
  });

  useUpdateEffect(() => {
    if (!value) {
      setPlugins([]);
      return;
    }
    if (plugin) {
      console.log('通知到插件');
      return;
    }
    if (index !== 1) {
      setIndex(1);
    }
    toolify.onSearch(value).then((data) => {
      console.log(generatePluginGroup(data));
      setPlugins(generatePluginGroup(data));
    });
  }, [value]);

  useMount(() => {
    // eventApi.on('main:pluginInfo', (_, data) => {
    //   setPlugin(data);
    // });
    // eventApi.on('main:clearPluginInfo', () => {
    //   setPlugin(undefined);
    // });
  });

  return {
    value,
    index,
    focus,
    plugin,
    plugins,
    pluginLoading,
    pluginMaxIndex,
    pluginList,
    setFocus,
    setIndex,
    onChange,
    onValueKeyDown,
    onOpenPlugin,
    onClosePlugin
  };
};

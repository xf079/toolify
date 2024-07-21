import { FC, useRef, useState } from 'react';
import { useMutationObserver, useUpdateEffect } from 'ahooks';
import { Typography, Flex, Tag, Segmented } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EnterOutlined
} from '@ant-design/icons';
import {
  MAIN_CHANGE_WINDOW_HEIGHT,
  MAIN_SYNC_CONFIG,
  WINDOW_PLUGIN_HEIGHT
} from '@main/config/constants';
import { useConfig } from '@/context';
import { useStyles } from './style';
import { ThemeOptions } from '@/config/enum';
import { RowItemPlugin } from '@/components/RowItem';

const { Text } = Typography;

export interface IResultProps {
  list: IPlugin[];
  current: number;
  onOpen: (item: IPlugin) => void;
}

const Result: FC<IResultProps> = ({ list, current, onOpen }) => {
  const { styles, cx } = useStyles();
  const { theme } = useConfig();
  const listRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [listHeight, setListHeight] = useState(0);
  const [toolbarHeight, setToolbarHeight] = useState(0);

  useUpdateEffect(() => {
    apeak.send(
      MAIN_CHANGE_WINDOW_HEIGHT,
      listHeight ? listHeight + toolbarHeight : 0
    );
  }, [listHeight, toolbarHeight]);

  useMutationObserver(
    () => {
      let _toolbarHeight = toolbarHeight;
      if (!_toolbarHeight) {
        _toolbarHeight = toolbarRef.current?.offsetHeight || 0;
      }
      const _listHeight = listRef.current?.offsetHeight;
      setListHeight(
        _listHeight > WINDOW_PLUGIN_HEIGHT - _toolbarHeight
          ? WINDOW_PLUGIN_HEIGHT - _toolbarHeight
          : _listHeight
      );
      setToolbarHeight(_toolbarHeight);
    },
    listRef,
    { attributes: true, childList: true, characterData: true, subtree: true }
  );

  return (
    <div className={styles.container}>
      <div className={styles.content} style={{ height: listHeight }}>
        <div className={cx(styles.list, 'scroll')} ref={listRef}>
          {list.map((item, index) => (
            <RowItemPlugin
              key={index}
              source={item}
              index={index}
              current={current}
              onClick={onOpen}
            />
          ))}
        </div>
      </div>
      <Flex className={styles.toolbar} justify='space-between' ref={toolbarRef}>
        <Flex align='center' gap={16}>
          <Flex gap={0}>
            <Tag icon={<ArrowDownOutlined />} />
            <Tag icon={<ArrowUpOutlined />} />
            <Text type='secondary'>切换</Text>
          </Flex>
          <Flex gap={0}>
            <Tag icon={<EnterOutlined />} />
            <Text type='secondary'>选中</Text>
          </Flex>
          <Flex gap={0}>
            <Tag children='Esc' />
            <Text type='secondary'>退出</Text>
          </Flex>
        </Flex>
        <Segmented
          options={ThemeOptions}
          value={theme.theme}
          size='middle'
          onChange={(value) => {
            apeak.send(MAIN_SYNC_CONFIG, {
              type: 'theme',
              value: {
                theme: value
              }
            });
          }}
        />
      </Flex>
    </div>
  );
};

export default Result;

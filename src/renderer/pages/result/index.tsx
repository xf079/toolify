import { useRef, useState } from 'react';
import { useMount, useMutationObserver, useUpdateEffect } from 'ahooks';
import { Typography, Flex, Tag, Segmented, Image } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EnterOutlined
} from '@ant-design/icons';
import {
  MAIN_CHANGE_WINDOW_HEIGHT,
  MAIN_SEARCH_RESULT,
  MAIN_SYNC_FORM_DATA
} from '@common/constants/event-main';
import { useConfig } from '@/context';
import { useStyles } from './style';

import FanYiIcon from '@/assets/icon/fanyi-icon.svg?react';

const { Text } = Typography;

const themeOptions = [
  { label: '跟随系统', value: 'system' },
  { label: '深色', value: 'dark' },
  { label: '浅色', value: 'light' }
];

function RecentlyPage() {
  const { styles, cx } = useStyles();
  const { theme } = useConfig();
  const [list, setList] = useState([]);
  const listRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [listHeight, setListHeight] = useState(0);
  const [toolbarHeight, setToolbarHeight] = useState(0);

  useUpdateEffect(() => {
    apeak?.trigger(
      MAIN_CHANGE_WINDOW_HEIGHT,
      listHeight ? listHeight + toolbarHeight : 0
    );
  }, [listHeight, toolbarHeight]);

  useMutationObserver(
    () => {
      if (!toolbarHeight) {
        setToolbarHeight(toolbarRef.current?.offsetHeight);
      }
      const _listHeight = listRef.current?.offsetHeight;
      setListHeight(_listHeight > 400 ? 400 : _listHeight);
    },
    listRef,
    { attributes: true, childList: true, characterData: true, subtree: true }
  );

  useMount(() => {
    apeak?.on(MAIN_SEARCH_RESULT, (event, value) => {
      console.log(value);
      setList(value);
    });
  });
  return (
    <div className={styles.container}>
      <div className={styles.content} style={{ height: listHeight }}>
        <div className={cx(styles.list, 'scroll')} ref={listRef}>
          {list.map((item, index) => (
            <div className={styles.item} key={index}>
              {item.icon ? (
                <Image src={item.icon} style={{ width: 32, height: 32 }} />
              ) : null}
              {item.fileName ? <span>{item.fileName}</span> : null}
            </div>
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
          options={themeOptions}
          value={theme.theme}
          size='middle'
          onChange={(value) => {
            apeak.trigger(MAIN_SYNC_FORM_DATA, {
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
}

export default RecentlyPage;

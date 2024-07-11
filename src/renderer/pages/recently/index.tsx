import { useRef, useState } from 'react';
import { useMount, useMutationObserver } from 'ahooks';
import { useStyles } from '@/pages/recently/style';
import { Typography, Flex, Tag, Segmented } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EnterOutlined
} from '@ant-design/icons';

const { Text } = Typography;

function RecentlyPage() {
  const { styles } = useStyles();
  const [list, setList] = useState([]);
  const ref = useRef<HTMLDivElement>(null);


  useMutationObserver(
    () => {
      const height = ref.current?.offsetHeight;
      window.ipcRenderer?.send('setWindowHeight', height > 400 ? 400 : height);
    },
    ref,
    { attributes: true, childList: true, characterData: true, subtree: true }
  );

  useMount(() => {
    window.ipcRenderer?.on('searchList', (event, value) => {
      setList(value);
    });
  });
  return (
    <div className={styles.container} ref={ref}>
      {list.length ? (
        <>
          <div className={styles.content}>
            {list.map((item, index) => (
              <div className='hot-item' key={index}>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Flex className={styles.toolbar} justify='space-between'>
            <Flex align='center' gap={6}>
              <Flex gap={2}>
                <Tag icon={<ArrowDownOutlined />} />
                <Tag icon={<ArrowUpOutlined />} />
                <Text type='secondary'>切换</Text>
              </Flex>
              <Flex gap={2}>
                <Tag icon={<EnterOutlined />} />
                <Text type='secondary'>选中</Text>
              </Flex>
              <Flex gap={2}>
                <Tag children='Esc' />
                <Text type='secondary'>退出</Text>
              </Flex>
            </Flex>
            <Segmented<string>
              options={['跟随系统', '深色', '浅色']}
              size='middle'
              onChange={(value) => {
                console.log(value); // string
              }}
            />
          </Flex>
        </>
      ) : null}
    </div>
  );
}

export default RecentlyPage;

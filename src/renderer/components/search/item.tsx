import { FC } from 'react';
import { Avatar, Flex, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { ArrowRightOutlined, MoreOutlined } from '@ant-design/icons';

const useStyles = createStyles(({ token, css }) => ({
  item: css`
    border-radius: 9999px;
    &:hover {
      background-color: ${token.colorBgTextHover};
    }

    &.active {
      background-color: ${token.colorBgTextActive};
    }
  `,
  title: css`
    font-size: 14px;
    color: ${token.colorTextHeading};
  `
}));

export interface ISearchItemProps {
  item: IPlugin;
  active: boolean;
  onOpenPlugin: (item: IPlugin) => void;
}

export const SearchItem: FC<ISearchItemProps> = ({
  item,
  active,
  onOpenPlugin
}) => {
  const { styles, cx } = useStyles();
  return (
    <Flex
      className={cx(
        styles.item,
        'w-full px-3 h-10 cursor-pointer rounded-sm overflow-hidden',
        active ? styles.item : ''
      )}
      align='center'
      onClick={() => onOpenPlugin(item)}
    >
      <Flex justify='start' align='center' className='gap-2 flex-1'>
        {item.type === 'more' ? (
          <>
            <div className='w-5 h-5 flex flex-row items-center justify-center'>
              <MoreOutlined />
            </div>
            <div className={styles.title}>{item.name}</div>
          </>
        ) : (
          <>
            <Avatar src={item.logo} size='small' />
            <div
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: item.nameFormat }}
            />
          </>
        )}
      </Flex>
      <Typography.Text type='secondary' className='text-xs'>
        {item.type === 'more' ? <ArrowRightOutlined /> : null}
        {item.type === 'app' ? '' : item.desc}
      </Typography.Text>
    </Flex>
  );
};

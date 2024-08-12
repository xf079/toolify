import { FC } from 'react';
import { Avatar, Flex, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { EnterOutlined, MoreOutlined } from '@ant-design/icons';

const useStyles = createStyles(({ token, css }) => ({
  item: css`
    border-radius: 9999px;
    transition: all 0.04s ease-in-out;
    &:hover {
      background-color: ${token.colorBgTextHover};
    }

    &.active {
      background-color: ${token.colorBgTextHover};
    }
  `,
  title: css`
    font-size: 14px;
    font-weight: 500;
    color: ${token.colorTextHeading};
  `
}));

export interface ISearchItemProps {
  type: IResultEnumType;
  item: IResultType;
  active: boolean;
  onOpenPlugin: (item: IResultType, type: IResultEnumType) => void;
}

export const SearchItem: FC<ISearchItemProps> = ({
  type,
  item,
  active,
  onOpenPlugin
}) => {
  const { styles, cx } = useStyles();

  return (
    <Flex
      className={cx(
        styles.item,
        'item w-full px-3 h-10 cursor-pointer rounded-sm overflow-hidden',
        active ? 'active' : ''
      )}
      align='center'
      onClick={() => onOpenPlugin(item, type)}
    >
      <Flex justify='start' align='center' className='gap-2 flex-1'>
        {item.type === 'more' ? (
          <>
            <div className='w-5 h-5 flex flex-row items-center justify-center'>
              <MoreOutlined />
            </div>
            <div className={styles.title}>{item.label}</div>
          </>
        ) : (
          <>
            <Avatar src={item.logo} shape='square' size='small' />
            <div
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: item.nameFormat }}
            />
          </>
        )}
      </Flex>
      <Typography.Text type='secondary' className='text-xs'>
        {item.type === 'more' && active ? <EnterOutlined /> : null}
        {item.type === 'app' ? '' : item.desc}
      </Typography.Text>
    </Flex>
  );
};

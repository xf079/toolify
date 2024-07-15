import { useStyles } from './style';
import { Flex, Image, Typography } from 'antd';
import { FC } from 'react';

const { Title, Text } = Typography;

export interface IRowItemPluginProps {
  source: IPlugin;
  index: number;
  current: number;
  onClick: (item: IPlugin) => void;
}

export const RowItemPlugin: FC<IRowItemPluginProps> = ({
  source,
  index,
  current
}) => {
  const { styles, cx } = useStyles();
  return (
    <Flex
      className={cx(styles.item, index === current ? 'active' : '')}
      gap={8}
      align='center'
    >
      <Image
        src={source.logo}
        width={42}
        className={styles.logo}
        preview={false}
      />
      <Flex vertical justify='center' className={styles.content}>
        <Title level={5} style={{ margin: 0 }}>
          {source.name}
        </Title>
        <Text type='secondary'>{source.desc}</Text>
      </Flex>
      <Text type='secondary'>{source.desc}</Text>
    </Flex>
  );
};

export interface IRowItemAppProps {
  source: IApplication;
  index: number;
  current: number;
  onClick: (item: IApplication) => void;
}

export const RowItemApp: FC<IRowItemAppProps> = ({
  source,
  index,
  current
}) => {
  const { styles, cx } = useStyles();
  return (
    <Flex
      className={cx(styles.item, index === current ? 'active' : '')}
      gap={8}
      align='center'
    >
      <Image
        src={source.icon}
        width={42}
        className={styles.logo}
        preview={false}
      />
      <Flex vertical justify='center' className={styles.content}>
        <Title level={5} style={{ margin: 0 }}>
          {source.name}
        </Title>
        <Text type='secondary'>{source.target}</Text>
      </Flex>
    </Flex>
  );
};

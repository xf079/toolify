import { Avatar, Button, Flex, Typography } from 'antd';
import { Fragment, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { SEPARATE_TOOLBAR_HEIGHT } from '@config/constants';
import { useOs } from '@/hooks/useOs';
import { useStyles } from './style';

import MaxIcon from '../assets/max.svg?react';
import RestoreIcon from '../assets/restore.svg?react';
import MinIcon from '../assets/min.svg?react';
import CloseIcon from '../assets/close.svg?react';
import DebugIcon from '../assets/debug.svg?react';
import PinedIcon from '../assets/pined.svg?react';
import UnPinedIcon from '../assets/un-pined.svg?react';
import SettingIcon from '../assets/settings.svg?react';
import ScaleIcon from '../assets/scale.svg?react';
import InfoIcon from '../assets/info.svg?react';

export default function Container() {
  const { styles, cx } = useStyles();

  const winId = window.winId;
  const plugin = JSON.parse(window.plugin || '{}') as IPlugin;
  const eventName = `detach:${winId}`;

  const [isMaximize, setIsMaximize] = useState(false);
  const [pined, setPined] = useState(false);
  const { isMac } = useOs();

  const onOpenDebug = () => {
    eventApi.send(eventName, { type: 'debug' });
  };

  const onTogglePined = useMemoizedFn(() => {
    eventApi.send(eventName, { type: pined ? 'un-pined' : 'pined' });
    setPined(!pined);
  });

  const onOpenSettings = () => {
    eventApi.send(eventName, { type: 'settings' });
  };

  const onOpenScale = () => {
    eventApi.send(eventName, { type: 'scale' });
  };

  const onOpenInfo = () => {
    eventApi.send(eventName, { type: 'info' });
  };

  const onMinimize = () => {
    eventApi.send(eventName, { type: `minimize` });
  };

  const onToggleMaximize = useMemoizedFn(() => {
    eventApi.send(eventName, { type: isMaximize ? `restore` : 'maximize' });
    setIsMaximize(!isMaximize);
  });

  const onCloseWin = () => {
    eventApi.send(eventName, { type: 'close' });
  };

  return (
    <Flex
      className={cx(styles.toolbar, isMac ? 'pl-20' : '')}
      justify='space-between'
      align='center'
    >
      <Flex gap={12} className='pl-2.5' align='center'>
        {plugin ? (
          <Fragment>
            <Avatar
              src={plugin.logo}
              size={SEPARATE_TOOLBAR_HEIGHT * 0.6}
              shape='square'
              className={cx(styles.logo, 'p-1')}
            />
            <Typography.Text strong>{plugin.name}</Typography.Text>
          </Fragment>
        ) : null}
      </Flex>
      <Flex gap={12} align='center'>
        <Flex align='center' gap={14} className='pr-2'>
          <Button
            className={styles.obtn}
            type='text'
            size='middle'
            onClick={onOpenInfo}
            icon={<InfoIcon className='w-[18px]' />}
          />
          <Button
            className={styles.obtn}
            type='text'
            size='middle'
            onClick={onOpenScale}
            icon={<ScaleIcon className='w-[18px]' />}
          />
          <Button
            className={styles.obtn}
            type='text'
            size='middle'
            onClick={onOpenSettings}
            icon={<SettingIcon className='w-[18px]' />}
          />
          <Button
            className={styles.obtn}
            type='text'
            size='middle'
            onClick={onTogglePined}
            icon={
              pined ? (
                <UnPinedIcon className='w-[18px]' />
              ) : (
                <PinedIcon className='w-[18px]' />
              )
            }
          />
          <Button
            className={styles.obtn}
            type='text'
            size='middle'
            onClick={onOpenDebug}
            icon={<DebugIcon className='w-[18px]' />}
          />
        </Flex>
        {!isMac ? (
          <Flex gap={6}>
            <Flex
              className={styles.btn}
              justify='center'
              align='center'
              onClick={onMinimize}
            >
              <MinIcon className='w-3.5 h-3.5' />
            </Flex>
            <Flex
              className={styles.btn}
              justify='center'
              align='center'
              onClick={onToggleMaximize}
            >
              {isMaximize ? (
                <RestoreIcon className='w-3.5 h-3.5' />
              ) : (
                <MaxIcon className='w-3.5 h-3.5' />
              )}
            </Flex>
            <Flex
              className={cx(styles.btn, styles.btnClose)}
              justify='center'
              align='center'
              onClick={onCloseWin}
            >
              <CloseIcon className='w-3.5 h-3.5' />
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
}

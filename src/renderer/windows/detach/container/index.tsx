import { Avatar, Button, Flex, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
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
  const [plugin, setPlugin] = useState<IPlugin>();
  const [isMaximize, setIsMaximize] = useState(false);
  const [pined, setPined] = useState(false);
  const { isMac } = useOs();

  const onOpenDebug = () => {
    console.log('debug');
    toolify.detachService('debug');
  };

  const onTogglePined = useMemoizedFn(() => {
    toolify.detachService(pined ? 'un-pined' : 'pined');
    setPined(!pined);
  });

  const onOpenSettings = () => {
    toolify.detachService('settings');
  };

  const onOpenScale = () => {
    toolify.detachService('scale');
  };

  const onOpenInfo = () => {
    toolify.detachService('info');
  };

  const onMinimize = () => {
    toolify.detachService('minimize');
  };

  const onToggleMaximize = useMemoizedFn(() => {
    toolify.detachService(isMaximize ? `restore` : 'maximize');
    setIsMaximize(!isMaximize);
  });

  const onCloseWin = () => {
    toolify.detachService('close');
  };

  const onKeyDownHandle = (e: KeyboardEvent) => {
    if (toolify.isMacOs()) {
      if (e.code === 'Escape') {
        toolify.detachService('leave-fullscreen');
      }
      if (e.metaKey && (e.code === 'KeyW' || e.code === 'KeyQ')) {
        toolify.detachService('close');
      }
    } else {
      if (e.ctrlKey && e.code === 'KeyW') {
        toolify.detachService('close');
        return;
      }
    }
  };

  useEffect(() => {
    toolify.initDetach(function(options){
      setPlugin(options.plugin);
    })

    window.enterFullScreen = () => {
      setIsMaximize(true);
    };
    window.leaveFullScreen = () => {
      setIsMaximize(false);
    };
    window.addEventListener('keydown', onKeyDownHandle);
    return () => {
      window.removeEventListener('keydown', onKeyDownHandle);
    };
  }, []);

  return (
    <Flex
      className={cx(styles.toolbar, isMac && !isMaximize ? 'pl-20' : '')}
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
        ) : (
          <div />
        )}
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

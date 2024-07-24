import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon
} from '@radix-ui/react-icons';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command';
import { FC, useRef, useState } from 'react';
import { useMutationObserver, useUpdateEffect } from 'ahooks';
import { Typography } from 'antd';
import {
  MAIN_CHANGE_WINDOW_HEIGHT,
  WINDOW_PLUGIN_HEIGHT
} from '@main/config/constants';
import { useStyles } from './style';

const { Text } = Typography;

export interface IResultProps {
  list: IPlugin[];
  current: number;
  onOpen: (item: IPlugin) => void;
}

const Result: FC<IResultProps> = ({ list, current, onOpen }) => {
  const { styles, cx } = useStyles();
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
      <Command className='rounded-lg border shadow-md'>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading='Suggestions'>
            <CommandItem>
              <CalendarIcon className='mr-2 h-4 w-4' />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <FaceIcon className='mr-2 h-4 w-4' />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon className='mr-2 h-4 w-4' />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading='Settings'>
            <CommandItem>
              <PersonIcon className='mr-2 h-4 w-4' />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <EnvelopeClosedIcon className='mr-2 h-4 w-4' />
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <GearIcon className='mr-2 h-4 w-4' />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Result;

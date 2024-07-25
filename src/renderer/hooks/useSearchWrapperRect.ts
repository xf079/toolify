import { useRef, useState } from 'react';
import { useMutationObserver, useUpdateEffect } from 'ahooks';
import {
  MAIN_CHANGE_WINDOW_HEIGHT,
  WINDOW_PLUGIN_HEIGHT
} from '@main/config/constants';

export const useSearchWrapperRect = () => {
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
          : _listHeight > 30
            ? _listHeight
            : 0
      );
      setToolbarHeight(_toolbarHeight);
    },
    listRef,
    { attributes: true, childList: true, characterData: true, subtree: true }
  );

  return {
    listRef,
    toolbarRef,
    listHeight,
    toolbarHeight
  };
};

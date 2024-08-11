import { useRef, useState } from 'react';
import { useMutationObserver, useUpdateEffect } from 'ahooks';
import { WINDOW_PLUGIN_HEIGHT } from '@config/constants';

export const useSearchWrapperRect = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [listHeight, setListHeight] = useState(0);
  const [toolbarHeight, setToolbarHeight] = useState(0);

  useUpdateEffect(() => {
    console.log(listHeight ? listHeight + toolbarHeight : 0);
    eventApi.send(
      'main:updateWinHeight',
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
      if (_toolbarHeight > WINDOW_PLUGIN_HEIGHT - _toolbarHeight) {
        setListHeight(WINDOW_PLUGIN_HEIGHT - _toolbarHeight);
      } else {
        setListHeight(_listHeight > 30 ? _listHeight : 0);
      }
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

import { MutableRefObject, useRef, useState } from 'react';
import { useMutationObserver, useUpdateEffect } from 'ahooks';
import { WINDOW_PLUGIN_HEIGHT } from '@config/constants';

export interface IContainerHeight {
  listRef: MutableRefObject<HTMLDivElement | null>;
  toolbarRef: MutableRefObject<HTMLDivElement | null>;
  onChange: (height: number) => void;
}

export const useContainerHeight = (options: IContainerHeight) => {

  const {listRef,toolbarRef,onChange} = options;

  const [listHeight, setListHeight] = useState(0);
  const [toolbarHeight, setToolbarHeight] = useState(0);

  useUpdateEffect(() => {
    console.log(listHeight ? listHeight + toolbarHeight : 0);
    onChange(listHeight ? listHeight + toolbarHeight : 0)
    toolify.setExpendHeight(listHeight ? listHeight + toolbarHeight : 0);
  }, [listHeight, toolbarHeight]);

  useMutationObserver(
    () => {
      let _toolbarHeight = toolbarHeight;
      if (!_toolbarHeight) {
        _toolbarHeight = toolbarRef.current?.offsetHeight || 0;
      }
      const _listHeight = listRef.current?.offsetHeight;
      setToolbarHeight(_toolbarHeight);
      if (_toolbarHeight > WINDOW_PLUGIN_HEIGHT - _toolbarHeight) {
        setListHeight(WINDOW_PLUGIN_HEIGHT - _toolbarHeight);
      } else {
        setListHeight(_listHeight > 30 ? _listHeight : 0);
      }
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

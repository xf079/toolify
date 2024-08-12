import { MutableRefObject, useRef, useState } from 'react';
import { useMutationObserver, useUpdateEffect } from 'ahooks';
import { WINDOW_PLUGIN_HEIGHT } from '@config/constants';

export interface IContainerHeight {
  listRef: MutableRefObject<HTMLDivElement | null>;
  toolbarRef: MutableRefObject<HTMLDivElement | null>;
  onChange: (height: number) => void;
}

export const useContainerHeight = (options: IContainerHeight) => {
  const { listRef, toolbarRef, onChange } = options;
  const toolbarHeight = useRef(0);
  const [listHeight, setListHeight] = useState(0);

  useUpdateEffect(() => {
    const _height = listHeight + toolbarHeight.current;
    console.log(listHeight,_height);
    onChange(listHeight);
    toolify.setExpendHeight(listHeight > 0 ? _height  : 0);
  }, [listHeight]);

  useMutationObserver(
    () => {
      let _toolbarHeight = toolbarHeight.current;
      if (!_toolbarHeight) {
        toolbarHeight.current = toolbarRef.current?.offsetHeight || 0;
        _toolbarHeight = toolbarHeight.current;
      }
      const maxContentHeight = WINDOW_PLUGIN_HEIGHT - _toolbarHeight;
      const _listHeight = listRef.current?.offsetHeight;
      if (_listHeight >= maxContentHeight) {
        setListHeight(maxContentHeight);
      } else {
        setListHeight(_listHeight > 30 ? _listHeight : 0);
      }
    },
    listRef,
    { attributes: true, childList: true, characterData: true, subtree: true }
  );
};

import { MutableRefObject, useState } from 'react';
import { useMutationObserver, useUpdateEffect } from 'ahooks';
import { WINDOW_PLUGIN_HEIGHT, WINDOW_TOOLBAR_HEIGHT } from '@config/constants';

export interface IContainerHeight {
  listRef: MutableRefObject<HTMLDivElement | null>;
  onChange: (height: number) => void;
}

export const useContainerHeight = (options: IContainerHeight) => {
  const { listRef, onChange } = options;
  const [listHeight, setListHeight] = useState(0);

  useUpdateEffect(() => {
    onChange(listHeight);
    toolify.setExpendHeight(listHeight > 0 ? listHeight +WINDOW_TOOLBAR_HEIGHT : 0);
  }, [listHeight]);

  useMutationObserver(
    () => {
      const maxContainerHeight = WINDOW_PLUGIN_HEIGHT-WINDOW_TOOLBAR_HEIGHT
      const _listHeight = listRef.current?.offsetHeight;
      if (_listHeight >= maxContainerHeight) {
        setListHeight(maxContainerHeight);
      } else {
        setListHeight(_listHeight > 40 ? _listHeight : 0);
      }
    },
    listRef,
    { attributes: true, childList: true, characterData: true, subtree: true }
  );
};

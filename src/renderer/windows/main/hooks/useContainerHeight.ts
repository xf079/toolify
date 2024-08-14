import { MutableRefObject, useState } from 'react';
import { useMutationObserver, useUpdateEffect } from 'ahooks';
import { WINDOW_PLUGIN_HEIGHT } from '@config/constants';

export interface IContainerHeight {
  listRef: MutableRefObject<HTMLDivElement | null>;
  onChange: (height: number) => void;
}

export const useContainerHeight = (options: IContainerHeight) => {
  const { listRef, onChange } = options;
  const [listHeight, setListHeight] = useState(0);

  useUpdateEffect(() => {
    onChange(listHeight);
    toolify.setExpendHeight(listHeight);
  }, [listHeight]);

  useMutationObserver(
    () => {
      const _listHeight = listRef.current?.offsetHeight;
      if (_listHeight >= WINDOW_PLUGIN_HEIGHT) {
        setListHeight(WINDOW_PLUGIN_HEIGHT);
      } else {
        setListHeight(_listHeight > 40 ? _listHeight : 0);
      }
    },
    listRef,
    { attributes: true, childList: true, characterData: true, subtree: true }
  );
};

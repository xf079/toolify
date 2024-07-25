import { useEventListener, useThrottleFn, useUpdateEffect } from 'ahooks';
import { MutableRefObject } from 'react';

export interface SearchScrollViewportOptions {
  wrapper: MutableRefObject<HTMLDivElement>;
  viewportHeight: number;
  current: number;
  setCurrent: (index: number) => void;
}

function getFirstFullyVisibleNode(scrollContainer: HTMLDivElement) {
  const nodes = scrollContainer.querySelectorAll('.item');

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const rect = node.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const topInViewport = rect.top - containerRect.top;
    const heightInViewport = rect.height;
    if (
      topInViewport >= 0 &&
      topInViewport + heightInViewport <= containerRect.height
    ) {
      return i;
    }
  }
  return null;
}

export const useSearchScrollViewport = (
  options: SearchScrollViewportOptions
) => {
  const viewportHeight = options.viewportHeight;
  const wrapper = options.wrapper.current;

  const { run } = useThrottleFn(
    (e) => {
      const domList: NodeListOf<HTMLDivElement> =
        document.querySelectorAll('.result .item');

      const currentDom = domList[options.current];
      if (currentDom) {
        const top = currentDom.offsetTop;
        const height = currentDom.clientHeight;

        // 获取滚动容器的当前滚动位置
        const currentScrollTop = wrapper.scrollTop;

        // 判断当前元素是否在视窗内
        if (
          top >= currentScrollTop &&
          top + height <= currentScrollTop + viewportHeight
        ) {
          return; // 如果在视窗内，不进行任何操作
        }
        options.setCurrent(getFirstFullyVisibleNode(options.wrapper.current));
      }
    },
    { wait: 300 }
  );

  useEventListener('scroll', run, { target: options.wrapper });

  useUpdateEffect(() => {
    const domList: NodeListOf<HTMLDivElement> =
      document.querySelectorAll('.result .item');
    const currentDom = domList[options.current];
    if (currentDom) {
      const top = currentDom.offsetTop;
      const height = currentDom.clientHeight;

      // 获取滚动容器的当前滚动位置
      const currentScrollTop = wrapper.scrollTop;

      // 判断当前元素是否在视窗内
      if (
        top >= currentScrollTop &&
        top + height <= currentScrollTop + viewportHeight
      ) {
        return; // 如果在视窗内，不进行任何操作
      }
      // 计算需要滚动的距离
      const scrollToPosition = top - height;

      // 进行滚动操作
      wrapper.scrollTop = scrollToPosition;
    }
  }, [options.current]);
};

import { cloneDeep, orderBy } from 'lodash';
import { nanoid } from 'nanoid';

const GroupTypeList: IGroupType[] = [
  {
    type: 'app',
    label: '系统应用',
    orderBy: 2,
    maxDisplayedNumber: 3,
    showDisplayed: false,
    children: [],
    origin: [],
    morePlugin: {
      id: nanoid(),
      type: 'more',
      name: '查看更多系统应用',
      main: 'app',
      logo: '',
      separation: false
    }
  },
  {
    type: 'plugin',
    label: '插件应用',
    orderBy: 1,
    maxDisplayedNumber: 4,
    showDisplayed: false,
    children: [],
    origin: [],
    morePlugin: {
      id: nanoid(),
      type: 'more',
      name: '查看更多插件',
      main: 'plugin',
      logo: '',
      separation: false
    }
  },
  {
    type: 'ai',
    label: 'AI应用',
    orderBy: 3,
    maxDisplayedNumber: 4,
    showDisplayed: false,
    children: [],
    origin: [],
    morePlugin: {
      id: nanoid(),
      type: 'more',
      name: '更多AI技能',
      main: 'ai',
      logo: '',
      separation: false
    }
  }
];

/**
 * 生成插件索引
 * @param data
 */
export const generateGroupIndex = (data: IGroupType[]) => {
  let count = 0;
  return data.map((item: IGroupType) => {
    const children = item.children.map((item: IPlugin) => {
      count += 1;
      return { ...item, index: count };
    });
    return {
      ...item,
      children
    };
  });
};

/**
 * 生成收起的插件列表
 * @param data
 */
export const generateDisplayedList = (data: IGroupType[]) => {
  return data.map((item) => ({
    ...item,
    children:
      !item.showDisplayed && item.origin.length > item.maxDisplayedNumber
        ? [...item.origin.slice(0, item.maxDisplayedNumber), item.morePlugin]
        : item.origin
  }));
};

/**
 * 生成插件分组
 * @param data
 */
export const generatePluginGroup = (data: IPlugin[]) => {
  const _groupList = cloneDeep(GroupTypeList);
  data.forEach((item: IPlugin) => {
    if (item.type === 'app') {
      _groupList[0].origin.push(item);
    } else if (item.type === 'built' || item.type === 'plugin') {
      _groupList[1].origin.push(item);
    } else if (item.type === 'ai') {
      _groupList[2].origin.push(item);
    }
  });
  const sortGroupList = orderBy(_groupList, 'orderBy');

  return generateGroupIndex(generateDisplayedList(sortGroupList)).filter(
    (item) => item.children.length
  );
};

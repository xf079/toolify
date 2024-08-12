import { cloneDeep, orderBy } from 'lodash';

const GroupTypeList: IGroupType[] = [
  {
    type: 'app',
    label: '系统应用',
    orderBy: 2,
    maxDisplayedNumber: 3,
    showDisplayed: false,
    children: [],
    origin: [],
    more: {
      type: 'more',
      label: '查看更多系统应用'
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
    more: {
      type: 'more',
      label: '查看更多插件'
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
    more: {
      type: 'more',
      label: '更多AI技能'
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
    return { ...item, children };
  });
};

/**
 * 生成收起的插件列表
 * @param data
 */
export const generateDisplayedList = (data: IGroupType[]) => {
  return data.map((item) => {
    let children: any[] = [];
    if (item.showDisplayed) {
      children = item.origin;
    } else {
      children = item.origin.slice(0, item.maxDisplayedNumber);
      if (item.origin.length > item.maxDisplayedNumber) {
        children.push(item.more);
      }
    }
    return {
      ...item,
      children
    };
  });
};


export const generateToggleGroupList = (
  data: IGroupType[],
  type: IResultEnumType
) => {
  return data.map((item) => {
    if (item.type === type) {
      const _showDisplayed = !item.showDisplayed;
      let children: any[] = [];
      if (_showDisplayed) {
        children = item.origin;
      } else {
        children = item.origin.slice(0, item.maxDisplayedNumber);
        if (item.origin.length > item.maxDisplayedNumber) {
          children.push(item.more);
        }
      }
      return {
        ...item,
        showDisplayed: !item.showDisplayed,
        children
      };
    }
    return item;
  });
};

/**
 * 生成插件分组
 * @param data
 */
export const generatePluginGroup = (data: ISearchResult) => {
  const _groupList = cloneDeep(GroupTypeList);
  const plugins = [];
  plugins.push(...(data.pluginList || []));
  plugins.push(...(data.featuresList || []));
  plugins.push(...(data.developerList || []));
  _groupList[1].origin = plugins;
  _groupList[0].origin = data.appList || [];
  _groupList[2].origin = data.aiList || [];

  const groupList = orderBy(_groupList, 'orderBy');

  return generateGroupIndex(generateDisplayedList(groupList)).filter(
    (item) => item.children.length > 0
  );
};

/**
 * 房屋租售
 */
const HousingDealContainer = () => import('@/pages/auxiliary-class/housing-deal/contatiner');
const HousingDealIndex = () => import('@/pages/auxiliary-class/housing-deal/index');
const HousingDealMyRelease = () => import('@/pages/auxiliary-class/housing-deal/my-release');
const HousingDealDetails = () => import('@/pages/auxiliary-class/housing-deal/details');
const HousingDealCollection = () => import('@/pages/auxiliary-class/housing-deal/collection');
const HousingDealRelease = () => import('@/pages/auxiliary-class/housing-deal/release');
const HousingDealCategory = () => import('@/pages/auxiliary-class/housing-deal/category');
const HousingDealReleaseSale = () => import('@/pages/auxiliary-class/housing-deal/release-sale');

export const housingDealRouter = {
  path: 'housingDeal',
  component: HousingDealContainer,
  children: [
    {
      meta: {title: "房屋租售", needJsSdk: true, defaultTab: true,},
      path: "/",
      name: "HousingDeal",
      component: HousingDealIndex
    },
    {
      meta: {title: "收藏-房屋租售", needJsSdk: true, defaultTab: true,},
      path: "collection",
      name: "Collection",
      component: HousingDealCollection
    },
    {
      meta: {title: "我的发布-房屋租售", needJsSdk: true, defaultTab: true,},
      path: "myRelease",
      name: "MyRelease",
      component: HousingDealMyRelease
    },
    {
      meta: {title: "发布-房屋租售", needJsSdk: true,},
      path: "release",
      name: "HousingDealRelease",
      component: HousingDealRelease
    }, {
      meta: {title: "发布-房屋买卖", needJsSdk: true,},
      path: "releaseSale",
      name: "HousingDealReleaseSale",
      component: HousingDealReleaseSale
    },
    {
      meta: {title: '详情-房屋租售', needJsSdk: true},
      path: "details",
      name: "HousingDealDetails",
      component: HousingDealDetails
    },
    {
      meta: {title: '分类列表-房屋租售', needJsSdk: true},
      path: "category",
      name: "HousingDealCategory",
      component: HousingDealCategory
    }
  ]
};

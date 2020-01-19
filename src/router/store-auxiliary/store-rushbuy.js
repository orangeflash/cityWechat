/**
 * 求职招聘
 */
const StoreRushbuyContainer = () => import('@/pages/store-auxiliary/store-rushbuy/contatiner');
const StoreManageRushbuy = () => import('@/pages/store-auxiliary/store-rushbuy/manage-rushbuy');
const StoreReleaseRushbuy = () => import('@/pages/store-auxiliary/store-rushbuy/release-rushbuy');
const RushbuyReceiveDetails = () => import('@/pages/store-auxiliary/store-rushbuy/receive-details');
export const storeRushbuyRouter = {
  path: 'storeRushbuy',
  component: StoreRushbuyContainer,
  children:[
    {
      meta: {title: "管理限时抢购",defaultTab: true, },
      path: "/",
      name: "StoreManageRushbuy",
      component: StoreManageRushbuy
    },
    {
      meta: {title: "发布限时抢购",needJsSdk: true},
      path: "storeReleaseRushbuy",
      name: "StoreReleaseRushbuy",
      component: StoreReleaseRushbuy
    },
    {
      meta: {title: "抢购订单列表",needJsSdk: true},
      path: "rushbuyReceiveDetails",
      name: "RushbuyReceiveDetails",
      component: RushbuyReceiveDetails
    },
    ]
};

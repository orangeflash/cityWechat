/**
 * 求职招聘
 */
const StoreGoodContainer = () => import('@/pages/store-auxiliary/store-good/contatiner');
const StoreManageOrder = () => import('@/pages/store-auxiliary/store-good/manage-order');
const StoreOrderDetail = () => import('@/pages/store-auxiliary/store-good/order-detail');
const StoreGoodList = () => import('@/pages/store-auxiliary/store-good/good-list');
const StoreReleaseGood = () => import('@/pages/store-auxiliary/store-good/release-good');
const StoreEditSpec = () => import('@/pages/store-auxiliary/store-good/edit-spec');
const StoreManageGood = () => import('@/pages/store-auxiliary/store-good/manage-good');
const StoreReleaseZtd = () => import('@/pages/store-auxiliary/store-good/release-ztd');
export const storeGoodRouter = {
  path: 'storeGood',
  component: StoreGoodContainer,
  children:[
    {
      meta: {title: "订单管理",defaultTab: true, },
      path: "/",
      name: "StoreManageOrder",
      component: StoreManageOrder
    },
    {
      meta: {title: "订单详情",needJsSdk: true},
      path: "storeOrderDetail",
      name: "StoreOrderDetail",
      component: StoreOrderDetail
    },
    {
      meta: {title: "商品管理",defaultTab: true, },
      path: "storeGoodList",
      name: "StoreGoodList",
      component: StoreGoodList
    },
    {
      meta: {title: "发布商品",needJsSdk: true},
      path: "storeReleaseGood",
      name: "StoreReleaseGood",
      component: StoreReleaseGood
    },
    {
      meta: {title: "编辑规格",},
      path: "storeEditSpec",
      name: "StoreEditSpec",
      component: StoreEditSpec
    },
    {
      meta: {title: "配送设置",defaultTab: true,},
      path: "storeManageGood",
      name: "StoreManageGood",
      component: StoreManageGood
    },
    {
      meta: {title: "自提点",needJsSdk: true,},
      path: "storeReleaseZtd",
      name: "StoreReleaseZtd",
      component: StoreReleaseZtd
    },
    ]
};

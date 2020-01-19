/**
 *  活动
 */
const StoreBargainContainer = () => import("@/pages/store-auxiliary/activity/container")
const StoreBargainyMy = () => import("@/pages/store-auxiliary/store-bargain/my-release")
const StoreBargainRelease = () => import("@/pages/store-auxiliary/store-bargain/release")
const StoreBargainMyOrder = () => import("@/pages/store-auxiliary/store-bargain/my-order")


export const storeBargainRouter = {
  path: 'storeBargain',
  component: StoreBargainContainer,
  children: [
    {
      meta: {title: "我发布的砍价", defaultTab: true,},
      path: "myRelease",
      name: "StoreBargainyMy",
      component: StoreBargainyMy
    }, {
      meta: {title: "发布砍价", needJsSdk: true},
      path: "release",
      name: "StoreBargainRelease",
      component: StoreBargainRelease
    },{
      meta: {title: "订单管理", needJsSdk: true},
      path: "myOrder",
      name: "StoreBargainMyOrder",
      component: StoreBargainMyOrder
    }
  ]
};


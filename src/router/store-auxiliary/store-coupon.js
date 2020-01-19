const StoreCouponContainer = () => import('@/pages/store-auxiliary/store-coupon/contatiner');
const StoreCouponList = () => import('@/pages/store-auxiliary/store-coupon/coupon-list');
const StoreReleaseCoupon = () => import('@/pages/store-auxiliary/store-coupon/release-coupon');
const CouponRelease = () => import('@/pages/store-auxiliary/store-coupon/release');
const CouponMyRelease = () => import('@/pages/store-auxiliary/store-coupon/my-release');


export const storeCouponRouter = {
  path: 'storeCoupon',
  component: StoreCouponContainer,
  children: [
    {
      meta: {title: "管理优惠券", defaultTab: true,},
      path: "/",
      name: "StoreCouponList",
      component: StoreCouponList
    },
    {
      meta: {title: "发布优惠券", needJsSdk: true},
      path: "storeReleaseCoupon",
      name: "StoreReleaseCoupon",
      component: StoreReleaseCoupon
    }, {
      meta: {title: "发布优惠券", needJsSdk: true},
      path: "storeCouponRelease",
      name: "StoreCouponRelease",
      component: CouponRelease
    }, {
      meta: {title: "我的发布", needJsSdk: true},
      path: 'storeMyRelease',
      name: "storeMyRelease",
      component: CouponMyRelease
    },
  ]
};

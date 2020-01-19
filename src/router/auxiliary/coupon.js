const CouponContainer = () => import('@/pages/auxiliary-class/coupon/contatiner');
const CouponIndex = () => import('@/pages/auxiliary-class/coupon/index');
const CouponDetails = () => import('@/pages/auxiliary-class/coupon/details');
const CouponMyReceive = () => import('@/pages/auxiliary-class/coupon/receive');
const CouponReceiveDetails = () => import('@/pages/auxiliary-class/coupon/receive-details');
const CouponWriteOff = () => import('@/pages/auxiliary-class/coupon/write-off');
const CouponMyReleaseReceiveDetails = () => import('@/pages/auxiliary-class/coupon/my-release-receive-details');


export const CouponRouter = {
  path: 'coupon',
  component: CouponContainer,
  children: [
    {
      meta: {title: "优惠劵", needJsSdk: true, defaultTab: true,},
      path: "/",
      name: "CouponIndex",
      component: CouponIndex
    }, {
      meta: {title: "优惠劵详情", needJsSdk: true,},
      path: "details",
      name: "CouponDetails",
      component: CouponDetails
    }, {
      meta: {title: "我的领取", needJsSdk: true, defaultTab: true},
      path: "myReceive",
      name: " CouponMyReceive",
      component: CouponMyReceive

    }, {
      meta: {title: "优惠详情", needJsSdk: true,},
      path: "receiveDetails",
      name: " CouponReceiveDetails",
      component: CouponReceiveDetails
    }, {
      meta: {title: "领取详情", needJsSdk: true,},
      path: "myReleaseReceiveDetails",
      name: " CouponMyReleaseReceiveDetails",
      component: CouponMyReleaseReceiveDetails
    }, {
      meta: {title: "商家扫码核销", needJsSdk: true,},
      path: "writeOff",
      name: " CouponWriteOff",
      component: CouponWriteOff
    }
  ]
}

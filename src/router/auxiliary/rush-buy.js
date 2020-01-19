/**
 * 求职招聘
 */
const RushBuyContainer = () => import('@/pages/auxiliary-class/rush-buy/contatiner');
const RushBuyIndex = () => import('@/pages/auxiliary-class/rush-buy/index');
const RushBuyDetails = () => import('@/pages/auxiliary-class/rush-buy/details');
const MyReceive = () => import('@/pages/auxiliary-class/rush-buy/receive');
const ReceiveDetails = () => import('@/pages/auxiliary-class/rush-buy/receive-details');
const MyVip = () => import('@/pages/auxiliary-class/vip/my-vip');
const PrivilegeCategory = () => import('@/pages/auxiliary-class/vip/privilege-category');
const ReceiveList= () => import('@/pages/auxiliary-class/vip/receive-list');
export const rushBuyRouter = {
  path: 'rushBuy',
  component: RushBuyContainer,
  children:[
    // {
    //   meta: {title: "求职招聘",needJsSdk:true,defaultTab: true, },
    //   path: "/",
    //   name: "JobHuntIndex",
    //   component: JobHuntIndex
    // },
    {
      meta: {title: "限时抢购",needJsSdk: true,defaultTab: true, },
      path: "/",
      name: "RushBuyIndex",
      component: RushBuyIndex
    },
    {
      meta: {title: "抢购详情",needJsSdk: true},
      path: "rushBuyDetails",
      name: "RushBuyDetails",
      component: RushBuyDetails
    },
    {
      meta: {title: "限时抢购订单",defaultTab: true,},
      path: "myReceive",
      name: "MyReceive",
      component: MyReceive
    },
    {
      meta: {title: "限时抢购订单详情",needJsSdk: true},
      path: "receiveDetails",
      name: "ReceiveDetails",
      component: ReceiveDetails
    },
    {
      meta: {title: "我的会员优惠",defaultTab: true,},
      path: "myVip",
      name: "MyVip",
      component: MyVip
    },
    {
      meta: {title: "全部特权",defaultTab: true,needJsSdk: true},
      path: "privilegeCategory",
      name: "PrivilegeCategory",
      component: PrivilegeCategory
    },
    {
      meta: {title: "领取列表",},
      path: "receiveList",
      name: "ReceiveList",
      component: ReceiveList
    },
    ]
};

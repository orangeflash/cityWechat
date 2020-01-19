/**
 * 求职招聘
 */
const VipContainer = () => import('@/pages/auxiliary-class/vip/contatiner');
const VipIndex = () => import('@/pages/auxiliary-class/vip/index');
const EnterVip = () => import('@/pages/auxiliary-class/vip/enter-vip');
const GiftDetails = () => import('@/pages/auxiliary-class/vip/gift-details');
const VerificationVip = () => import('@/pages/auxiliary-class/vip/verification-vip');
const PrivilegeDetails = () => import('@/pages/auxiliary-class/vip/privilege-details');
const MyVip = () => import('@/pages/auxiliary-class/vip/my-vip');
const PrivilegeCategory = () => import('@/pages/auxiliary-class/vip/privilege-category');
const ReceiveList= () => import('@/pages/auxiliary-class/vip/receive-list');
export const vipRouter = {
  path: 'vip',
  component: VipContainer,
  children:[
    // {
    //   meta: {title: "求职招聘",needJsSdk:true,defaultTab: true, },
    //   path: "/",
    //   name: "JobHuntIndex",
    //   component: JobHuntIndex
    // },
    {
      meta: {title: "会员卡",defaultTab: true, },
      path: "/",
      name: "VipIndex",
      component: VipIndex
    },
    {
      meta: {title: "会员卡",defaultTab: true,},
      path: "enterVip",
      name: "EnterVip",
      component: EnterVip
    },
    {
      meta: {title: "开卡礼包详情",needJsSdk: true},
      path: "giftDetails",
      name: "GiftDetails",
      component: GiftDetails
    },
    {
      meta: {title: "核销"},
      path: "verificationVip",
      name: "VerificationVip",
      component: VerificationVip
    },
    {
      meta: {title: "特权详情",needJsSdk: true},
      path: "privilegeDetails",
      name: "PrivilegeDetails",
      component: PrivilegeDetails
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
